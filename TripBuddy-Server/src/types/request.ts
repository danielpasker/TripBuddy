import { Request } from 'express';

interface RequestWithUserId extends Request {
  userId?: string;
}

interface JwtPayload {
  _id: string;
  random: string;
}

export type { RequestWithUserId, JwtPayload };
