import { Request, Response, NextFunction } from 'express';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

type RefractileConfigModule = {
  bin: string;
  make: string;
  src: string;
  gluecode_src: string;
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

function shouldBuild(moduleName: string): boolean {
  const mconfig: RefractileConfigModule = config.modules[moduleName];
  const src: string = mconfig['src'];
  const wasm = path.resolve(mconfig['bin'], `${moduleName}.wasm`);

  // Build it if the glue code is missing
  if (!fs.existsSync(wasm)) return true;
  // Build if the source code is newer than the gluecode
  if (
    src &&
    new Date(fs.statSync(src).mtime).getTime() >
      new Date(fs.statSync(wasm).mtime).getTime()
  )
    return true;

  // Otherwise return false
  return false;
}

function refract(module: string, method: string): ExpressMWare {
  let instance: Promise<RefractInstance>;
  // 1.0 look up configuration
  if (!config.modules || !config.modules[module])
    throw Error(
      'No configuration found for module ' +
        module +
        '. Check configuration at ' +
        dir
    );
  // 2.0 check module destination location
  if (!config.modules[module]['bin'])
    throw Error(
      'No bin destination found for module ' + '. Check configuration at ' + dir
    );

  // If there is no file in bin, try to make it
  if (shouldBuild(module)) {
    if (!config.modules[module]['make'])
      throw Error(
        'No make formula found for module ' + '. Check configuration at ' + dir
      );

    // Build it
    execSync(config.modules[module]['make']);

    if (
      !fs.existsSync(
        path.resolve(config.modules[module]['bin'], `${module}.wasm`)
      )
    )
      throw Error('Failed to build ' + module);

    if (
      !fs.existsSync(
        path.resolve(config.modules[module]['bin'], `${module}.js`)
      )
    ) {
      if (config.modules[module]['gluecode_src'])
        execSync(
          `cp ${config.modules[module]['gluecode_src']} ${config.modules[module]['bin']}/${module}.js`
        );
      else
        throw Error(
          `No gluecode located in bin folder assigned to module ${module}`
        );
    }
  }

  // Load it
  instance = require(path.resolve(
    config.modules[module]['bin'],
    `${module}.js`
  ))();

  return async (req: Request, res: Response, next: NextFunction) => {
    (await instance)[method](req, res, next);
  };
}

module.exports = refract;
