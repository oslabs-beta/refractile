"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
let dir;
let config;
// Load config
(() => {
    const packageName = require('../package.json').name;
    // Get the current working directory
    dir = process.cwd();
    for (;;) {
        // If the current working directory has a package.json, break
        if (fs.statSync(path.join(dir, 'package.json')).isFile())
            break;
        // eslint-disable-next-line no-empty
        // Otherwise, keep looking for it
        const parent = path.dirname(dir);
        if (dir === parent) {
            dir = null;
            break;
        }
        dir = parent;
    }
    // Once the current directory has been found, load the configuration file
    try {
        config = require(path.resolve(dir, 'refractile.config.js'));
    }
    catch (e) {
        throw Error('Error: problem loading refractile.config.js -- ' + e);
    }
    if (Array.isArray(config['preload_cmds']))
        config['preload_cmds'].forEach((cmd) => {
            try {
                execSync(cmd);
            }
            catch (e) {
                throw Error('Error: problem running preload_cmd: ' + cmd);
            }
        });
})();
function refract(src, method) {
    let instance;
    if (typeof src === 'string') {
        // 1.0 look up configuration
        if (!config.modules || !config.modules[src])
            throw Error('No configuration found for module ' +
                src +
                '. Check configuration at ' +
                dir);
        // 2.0 check module destination location
        if (!config.modules[src]['bin'])
            throw Error('No bin destination found for module ' +
                '. Check configuration at ' +
                dir);
        // If there is no file in bin, try to make it
        if (!fs.existsSync(path.resolve(config.modules[src]['bin'], `${src}.js`))) {
            if (!config.modules[src]['make'])
                throw Error('No make formula found for module ' +
                    '. Check configuration at ' +
                    dir);
            // Build it
            execSync(config.modules[src]['make']);
            // Check that it was made
            if (!fs.existsSync(path.resolve(config.modules[src]['bin'], `${src}.js`)))
                throw Error('Failed to build ' + src);
        }
        // Load it
        instance = require(path.resolve(config.modules[src]['bin'], `${src}.js`))();
    }
    else if (typeof src === 'function') {
        // 2.0 load the instance from the function
        instance = src();
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (yield instance)[method](req, res, next);
    });
}
module.exports = refract;
