import { Request, Response, NextFunction, RequestHandler } from 'express';

// Returns a promise that resolves to a WebAssembly instance
type FibInstance = {
  _fibonacci: (input: number) => number;
};

type FibController = {
  fibJS: (req: Request, res: Response, next: NextFunction) => void;
  fibC: (req: Request, res: Response, next: NextFunction) => void;
};

const instance: Promise<FibInstance> =
  require('../../../wasm-modules/fibonacci.js')();

function fibonacci(element: number): number {
  const sequence: Array<number> = [0, 1];
  for (let i: number = 2; i <= element; i++) {
    sequence[i] = sequence[i - 2] + sequence[i - 1];
  }
  return sequence[element];
}

export const fibController: FibController = {
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
