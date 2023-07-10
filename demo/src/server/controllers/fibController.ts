import { Request, Response, NextFunction, RequestHandler } from 'express';


// const fibonacci = (num: number): number => {
//   if (num < 2) {
//     return num;
//   } else {
//     return fibonacci(num - 1) + fibonacci(num - 2);
//   }
// }

function fibonacci(element: number) {
  const sequence = [0, 1];
  for (let i = 2; i <= element; i++) {
    sequence[i] = sequence[i - 2] + sequence[i - 1];
  }
  return sequence[element];
}

export const fibController = {

  fibJS: (req: Request, res: Response, next: NextFunction) => {
    const fibResult = fibonacci(50)
    res.locals.result = {
      result: fibResult
    }
    next()
  }
}