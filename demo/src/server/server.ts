import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { fibController } from './controllers/fibController';
import { ServerError } from '../types';
import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv'
import { benchmarkController } from './controllers/benchmarkController';

dotenv.config()

const app = express();

app.use(express.json());

// const mongoURI: string = 'THIS IS A MONGO URI TO BE IMPORTED FROM .ENV FILE'

const mongoURI: string = process.env.MONGO_URI

const db = mongoose.connection

async function main() {
  await mongoose.connect(mongoURI);
}

main().catch((err) => console.log(err));

db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
  console.log('Connected to database successfully')
})

app.get(
  '/api/fib-js/:value',
  fibController.fibJS,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

app.get(
  '/api/fib-c/:value',
  fibController.fibC,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

app.get(
  '/api/fib/benchmark/:language',
  benchmarkController.getBenchmarks,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.result)
  }
)

app.post(
  '/api/fib/benchmark',
  benchmarkController.postBenchmark,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals)
  }
)


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
