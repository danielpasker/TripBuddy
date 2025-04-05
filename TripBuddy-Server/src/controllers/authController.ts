import { NextFunction, Request, RequestHandler, Response } from 'express';
import bcrypt, { genSalt, hash } from 'bcrypt';
import jwt, { sign, verify } from 'jsonwebtoken';
import { IUser, userModel } from '@models/usersModel';
import { JwtPayload, RequestWithUserId } from '@customTypes/request';
import { OAuth2Client } from 'google-auth-library';
import { Env } from '@env';
import { BaseController } from './baseController';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '@utils/sendError';
import { HttpStatusCode } from 'axios';

const INVALID_CREDENTIALS = 'Invalid login credentials';
const INTERNAL_ERROR = 'Internal Server Error';
const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
const EMAIL_ALREADY_REGISTERED = 'Given email was already registered';

const googleAuthClient = new OAuth2Client();

class AuthController extends BaseController<IUser> {
  constructor() {
    super(userModel);
  }

  async register(request: Request, response: Response) {
    try {
      const existingUser = await this.model.exists({ email: request.body.email });

      if (existingUser !== null) {
        return sendError(response, StatusCodes.CONFLICT, EMAIL_ALREADY_REGISTERED);
      }

      const hashedPassword = await this.hashPassword(request.body.password)
      const userName = request.body.email.split('@')[0];
      const newUser = {
        ...request.body,
        userName,
        password: hashedPassword,
      }

      request.body = newUser
      await userModel.create(newUser);

      response.status(StatusCodes.CREATED).send('User registered successfully');
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, INTERNAL_ERROR, JSON.stringify(error))
    }
  }

  async login(request: Request, response: Response) {
    try {
      const user = await this.model.findOne({ email: request.body.email });

      if (!user) {
        return sendError(response, StatusCodes.UNAUTHORIZED, INVALID_CREDENTIALS)
      }

      const validPassword = await bcrypt.compare(
        request.body.password,
        user.password
      );

      if (!validPassword) {
        return sendError(response, StatusCodes.UNAUTHORIZED, INVALID_CREDENTIALS)
      }

      const tokens = await this.updateUserTokens(user);

      response.status(StatusCodes.OK).send({
        userName: user.userName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        profileImageUrl: user.profileImageUrl,
        _id: user._id,
      });
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, INTERNAL_ERROR, JSON.stringify(error))
    }
  };

  async googleLogin(request: Request, response: Response) {
    const credential = request.body.credential;

    try {
      const ticket = await googleAuthClient.verifyIdToken({
        idToken: credential,
        audience: Env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload?.email;
      let user = await this.model.findOne({ email });

      if (user == null) {
        const userName = email?.split('@')[0];

        user = await this.model.create({
          email: email,
          password: `${Math.random()}${payload?.iat}`,
          profileImageUrl: payload?.picture,
          userName,
        });
      }

      const tokens = await this.updateUserTokens(user);

      response.status(StatusCodes.OK).send({
        userName: user.userName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _id: user._id,
      });
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, INTERNAL_ERROR, JSON.stringify(error))
    }
  };

  async getCurrentUserData(request: RequestWithUserId, response: Response) {
    try {
      const user = await this.model.findById(request.userId, { refreshToken: 0, password: 0 })
        .lean();
      response.status(StatusCodes.OK).json(user);
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, INTERNAL_ERROR, JSON.stringify(error))
    }
  };

  async refreshUserToken(request: Request, response: Response) {
    try {
      const refreshToken = request.body.refreshToken;
      const user = await this.getUserByJwtToken(refreshToken);

      if (!user) {
        return sendError(response, StatusCodes.BAD_REQUEST, INVALID_REFRESH_TOKEN)
      }

      const isInvalidationSuccessful = await this.invalidateRefreshToken(refreshToken, user);

      if (!isInvalidationSuccessful) {
        return sendError(response, StatusCodes.BAD_REQUEST, INVALID_REFRESH_TOKEN)
      }

      const newTokens = this.generateUserJwtToken(user._id);

      await this.model.findByIdAndUpdate(user._id, {
        refreshToken: !user.refreshToken ? [] : user.refreshToken.concat(newTokens.refreshToken)
      })

      response.status(HttpStatusCode.Ok).send({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        _id: user._id,
      });
    } catch (error) {
      return sendError(response, StatusCodes.BAD_REQUEST, INVALID_REFRESH_TOKEN, JSON.stringify(error))
    }
  };

  async logout(request: Request, response: Response) {
    try {
      const refreshToken = request.body.refreshToken;
      const user = await this.getUserByJwtToken(refreshToken);

      if (!user) {
        return sendError(response, StatusCodes.BAD_REQUEST, INVALID_REFRESH_TOKEN)
      }

      const isInvalidationSuccessful = await this.invalidateRefreshToken(refreshToken, user);

      if (!isInvalidationSuccessful) {
        return sendError(response, StatusCodes.BAD_REQUEST, INVALID_REFRESH_TOKEN)
      }

      response.status(StatusCodes.OK).send('logout successfully');
    } catch (error) {
      return sendError(response, StatusCodes.UNAUTHORIZED, INVALID_REFRESH_TOKEN, JSON.stringify(error))
    }
  };

  private async invalidateRefreshToken(refreshToken: string | undefined, user: IUser) {
    if (!refreshToken) {
      return false;
    }
    try {
      if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
        await this.model.findByIdAndUpdate(user._id, {
          refreshToken: []
        })

        return false;
      }

      await this.model.findByIdAndUpdate(user._id, {
        refreshToken: user.refreshToken?.filter(
          (token) => token !== refreshToken
        )
      })

      return true;
    } catch (error) {
      console.error('Failed to verify refresh token');
      throw new Error(JSON.stringify(error))
    }
  }

  private async getUserByJwtToken(token?: string) {
    if (!token) {
      return null;
    }

    try {
      const jwtPayload = verify(
        token,
        Env.JWT_TOKEN_SECRET
      ) as JwtPayload;

      return await userModel.findById(jwtPayload._id);
    } catch (error) {
      console.error('Failed to verify refresh token');
      throw error
    }
  }

  private generateUserJwtToken(userId: string) {
    const random = Math.random().toString();
    const accessToken = sign(
      {
        _id: userId,
        random,
      },
      Env.JWT_TOKEN_SECRET,
      { expiresIn: Env.JWT_TOKEN_EXPIRATION }
    );

    const jwtContent: JwtPayload = {
      _id: userId,
      random,
    };

    const refreshToken = sign(jwtContent, Env.JWT_TOKEN_SECRET, {
      expiresIn: Env.REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  private async updateUserTokens(user: IUser) {
    const tokens = this.generateUserJwtToken(user._id);

    await this.model.findByIdAndUpdate(user._id, {
      refreshToken: !user.refreshToken ? [] : user.refreshToken
        .concat(tokens.refreshToken)
    })

    return tokens;
  };

  private async hashPassword(password: string) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }
}

export default new AuthController()