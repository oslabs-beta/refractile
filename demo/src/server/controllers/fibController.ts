import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ExpressMWare } from '../../types';
import refract from '../../../refractile/refractile';

// Returns a promise that resolves to a WebAssembly instance
function fibonacci(element: number): number {
  if (element < 2) return element;
  return fibonacci(element - 1) + fibonacci(element - 2);
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

  fibC: refract('fibonacci', 'fibonacci'),
  // fibAlt: async (
  //   { params: { value } }: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     res.locals.result = (await instance)._fibonacci(+value);
  //     return next();
  //   } catch (e) {
  //     return next({
  //       log: 'Failure in fibController.fibC -- ' + e,
  //       status: 500,
  //       message: { err: 'Could not produce fib result from C-based WASM ' },
  //     });
  //   }
  // },
};
