import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { verifyToken } from '../utils';
import { UnauthorizedError } from '../errors';
import { UserWithId } from '../api/v1/schemas';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithId;
    }
  }
}

interface TokenPayload extends jwt.JwtPayload {
  user?: UserWithId;
}

export function isAuthorized(req: Request, _res: Response, next: NextFunction): void {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    throw new UnauthorizedError('You must be logged in to access this resource');
  }

  if (!bearerToken.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid token format');
  }

  const token = bearerToken.replace('Bearer ', '');
  
  try {
    const decodedToken = verifyToken(token) as TokenPayload;

    if (!decodedToken.user) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = decodedToken.user;

    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');

    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token is invalid');

    } else {
      throw new UnauthorizedError('Failed to authenticate token');
    }
  }
}
