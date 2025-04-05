import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { postRouter } from '@routes/postsRoutes';
import { commentRouter } from '@routes/commentsRoutes';
import { userRouter } from '@routes/usersRoutes';
import { authRouter } from '@routes/authRoutes';
import { filesRouter } from '@routes/filesRoute';
import { tripPlanRouter } from '@routes/tripPlanRoutes';
import { setupSwagger } from './swaggerConfig';
import { Env, verifyEnvVariables } from '@env';
import { destinationsRouter } from '@routes/destinationsRoutes';

verifyEnvVariables();

const initDB = async () => {
  try {
    await mongoose.connect(Env.DB_CONNECTION_URL);
    console.log('connected to db');
  } catch (error) {
    console.error(`failed connecting to db: ${error}`);
  }
};

export const initApp = async () => {
  await initDB();

  const app = express();

  app.use(json({ limit: '50mb' }));
  app.use(cors());
  app.use(urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(express.static('front'));
  app.use('/posts', postRouter);
  app.use('/comments', commentRouter);
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/files', filesRouter);
  app.use('/trip-plan', tripPlanRouter);
  app.use('/destinations', destinationsRouter);

  setupSwagger(app);

  return app;
};