import { Request, Response, NextFunction } from 'express';

function refract(
  wasmSource: string | (() => Promise<any>),
  method: string
): (req: Request, res: Response, next: NextFunction) => Promise<any> {
  let instance: any;

  if (typeof wasmSource === 'string') instance = require(wasmSource)();

  return async (req: Request, res: Response, next: NextFunction) =>
    (await instance)[method]();
}

export default refract;
