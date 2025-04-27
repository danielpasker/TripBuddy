import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
dotenv.config({path: path.resolve(process.cwd(), `.env.${ENV}`)});

type PeriodString = `${number}${'m' | 'd'}`;

export const Env = {
  PORT: +process.env.PORT!,
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION! as PeriodString,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION! as PeriodString,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
  GOOGLE_API_BASE_URL: process.env.GOOGLE_API_BASE_URL!,
};

export const verifyEnvVariables = () => {
  Object.entries(Env).forEach(([key, value]) => {
    if (value === '' || value === undefined || value === null) {
      throw new Error(`Environment variable ${key} is undefined`);
    }
  });
};
