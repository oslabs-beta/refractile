import { Request, Response, NextFunction } from 'express';
const path = require('path');

function refract(
  wasmSource: string | (() => Promise<any>),
  method: string
): (req: Request, res: Response, next: NextFunction) => Promise<any> {
  let instance: any;

  if (typeof wasmSource === 'string') {
    const wasmDir = require('../refractile.config.js').directory;
    instance = require(`${wasmDir}/${wasmSource}.js`)();
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    (await instance)[method](req, res, next);
  };
}

export default refract;
