import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {json, urlencoded} from 'body-parser';
import {postRouter} from '@routes/postsRoutes';
import {commentRouter} from '@routes/commentsRoutes';
import {userRouter} from '@routes/usersRoutes';
import {authRouter} from '@routes/authRoutes';
import {filesRouter} from '@routes/filesRoute';
import {tripPlanRouter} from '@routes/tripPlanRoutes';
import {tripRouter} from '@routes/tripsRoutes';
import {chatsRouter} from '@routes/chatsRoutes';
import {joinRequestsRouter} from '@routes/joinRequestsRoutes';
import {setupSwagger} from './swaggerConfig';
import {Env, verifyEnvVariables} from '@env';
import {destinationsRouter} from '@routes/destinationsRoutes';
import {imageSearchRouter} from '@routes/ImageSearchRouter';
import path from 'node:path';
import {alertsRouter} from '@routes/alertsRoute';

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

  app.use(json({limit: '50mb'}));
  app.use(cors());
  app.use(urlencoded({extended: true}));
  app.get('/health', (_request: Request, response: Response) => {
    response.send('TripBuddy backend is up and running!');
  });
  app.use(express.static('public'));
  app.use('/posts', postRouter);
  app.use('/comments', commentRouter);
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/files', filesRouter);
  app.use('/trip-plan', tripPlanRouter);
  app.use('/trips', tripRouter);
  app.use('/destinations', destinationsRouter);
  app.use('/chats', chatsRouter);
  app.use('/join-requests', joinRequestsRouter);
  app.use('/alerts', alertsRouter);
  app.use('/image-search', imageSearchRouter);

  setupSwagger(app);

  if (Env.NODE_ENV === 'production') {
    const buildPath = path.normalize(path.join(__dirname, '../front'));
    app.use(express.static(buildPath));

    app.get('(/*)?', async (_req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

  return app;
};
