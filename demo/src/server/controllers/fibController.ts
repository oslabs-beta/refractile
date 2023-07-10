import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ExpressMWare } from '../../types';

// Returns a promise that resolves to a WebAssembly instance
type FibInstance = {
  _fibonacci: (input: number) => number;
};

type FibController = {
  fibJS: ExpressMWare;
  fibC: ExpressMWare;
};

const instance: Promise<FibInstance> =
  require('../../../wasm-modules/fibonacci.js')();

function fibonacci(element: number): number {
  if (element < 2) return element
  return fibonacci(element - 1) + fibonacci(element - 2)
}

export const fibController = {
  fibJS: (
    { params: { value } }: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.locals.result = fibonacci(+value);
      return next();
    } catch (e) {
      return next({
        log: 'Failure in fibController.fibJS -- ' + e,
        message: { err: 'Could not produce fib result from C-based WASM ' },
      });
    }
  },

  fibC: async (
    { params: { value } }: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.locals.result = (await instance)._fibonacci(+value);
      return next();
    } catch (e) {
      return next({
        log: 'Failure in fibController.fibC -- ' + e,
        status: 500,
        message: { err: 'Could not produce fib result from C-based WASM ' },
      });
    }
  },
};
