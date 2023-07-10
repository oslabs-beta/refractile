import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { fibController } from './controllers/fibController';
import { ServerError } from '../types';

const app = express();

app.use(express.json());

app.get('/api/fib-js', fibController.fibJS, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.result);
});

app.get('/api/fib-c', fibController.fibC, (req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

app.use('/', (req: Request, res: Response) => {
  return res.status(404).json('Error: page not found');
});

app.use(
  '/',
  (err: ServerError, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

app.listen(3000, () => console.log('server is listening on port 3000'));
