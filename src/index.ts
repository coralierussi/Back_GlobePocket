import express, { Router } from 'express';
import { userRouter } from './router/users';
import { authRouter } from './router/auth';
import cors from 'cors';
import 'dotenv/config'

const app = express();

app.use(express.json());
app.use(cors());

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

app.use('/api', apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
