import { Request, Response, NextFunction, RequestHandler } from 'express';


const fibonacci = (num: number): number => {
  if (num < 2) {
    return num;
  } else {
    return fibonacci(num - 1) + fibonacci(num - 2);
  }
}

export const fibController = {

  fibJS: (req: Request, res: Response, next: NextFunction) => {
    const fibResult = fibonacci(50)
    res.locals.result = {
      result: fibResult
    }
    console.log(res.locals.result)
    next()
  }
}