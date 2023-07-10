import { Request, Response, NextFunction, RequestHandler } from 'express';

export type FibJSProps = {};

export type FibOtherProps = {};

export type FibResult = {
  result: number;
};

export type ServerError = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

export type ExpressMWare = (
  req: Response,
  res: Response,
  next: NextFunction
) => void;
