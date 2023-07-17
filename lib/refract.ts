import { Request, Response, NextFunction } from 'express';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

type RefractileConfigModule = {
  bin: string;
  make: string;
};

type RefractileConfig = {
  preload_cmds: Array<string>;
  modules: {
    [module: string]: RefractileConfigModule;
  };
};

type ExpressMWare = (req: Request, res: Response, next: NextFunction) => void;
type RefractInstance = {
  [method: string]: ExpressMWare;
};

let dir: string | null;
let config: RefractileConfig;

// Load config
(() => {
  const packageName = require('../package.json').name;
  // Get the current working directory

  dir = process.cwd();
  for (;;) {
    // If the current working directory has a package.json, break
    if (fs.statSync(path.join(dir, 'package.json')).isFile()) break;
    // eslint-disable-next-line no-empty
    // Otherwise, keep looking for it
    const parent: string = path.dirname(dir);
    if (dir === parent) {
      dir = null;
      break;
    }
    dir = parent;
  }

  // Once the current directory has been found, load the configuration file
  try {
    config = require(path.resolve(dir, 'refractile.config.js'));
  } catch (e) {
    throw Error('Error: problem loading refractile.config.js -- ' + e);
  }

  if (Array.isArray(config['preload_cmds']))
    config['preload_cmds'].forEach((cmd) => {
      try {
        execSync(cmd);
      } catch (e) {
        throw Error('Error: problem running preload_cmd: ' + cmd);
      }
    });
})();

function refract(
  src: string | (() => Promise<RefractInstance>),
  method: string
): ExpressMWare {
  let instance: Promise<RefractInstance>;
  if (typeof src === 'string') {
    // 1.0 look up configuration
    if (!config.modules || !config.modules[src])
      throw Error(
        'No configuration found for module ' +
          src +
          '. Check configuration at ' +
          dir
      );
    // 2.0 check module destination location
    if (!config.modules[src]['bin'])
      throw Error(
        'No bin destination found for module ' +
          '. Check configuration at ' +
          dir
      );

    // If there is no file in bin, try to make it
    if (!fs.existsSync(path.resolve(config.modules[src]['bin'], `${src}.js`))) {
      if (!config.modules[src]['make'])
        throw Error(
          'No make formula found for module ' +
            '. Check configuration at ' +
            dir
        );

      // Build it
      execSync(config.modules[src]['make']);

      // Check that it was made
      if (!fs.existsSync(path.resolve(config.modules[src]['bin'], `${src}.js`)))
        throw Error('Failed to build ' + src);
    }

    // Load it
    instance = require(path.resolve(config.modules[src]['bin'], `${src}.js`))();
  } else if (typeof src === 'function') {
    // 2.0 load the instance from the function
    instance = src();
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    (await instance)[method](req, res, next);
  };
}

module.exports = refract;
