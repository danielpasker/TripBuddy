import { JwtPayload, RequestWithUserId } from "@customTypes/request";
import { Env } from "@env";
import { sendError } from "@utils/sendError";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";

export const authMiddleware = (
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
) => {
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
        return sendError(response, StatusCodes.UNAUTHORIZED, 'missing token');
    } else {
        verify(token, Env.JWT_TOKEN_SECRET, (error, payload) => {
            if (error) {
                return sendError(
                    response,
                    StatusCodes.UNAUTHORIZED,
                    'Invalid token',
                    JSON.stringify(error)
                );
            } else {
                request.userId = (<JwtPayload>payload)._id;
                next();
            }
        });
    }
};
