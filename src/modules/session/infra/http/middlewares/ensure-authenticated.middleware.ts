import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@/config/auth.config';
import { AppError } from '@/shared/errors/app-error.error';
import { Error } from '@/modules/session/utils/enums/errors.enum';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  name: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError(Error.MissingJWT, 401);

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, name } = decoded as TokenPayload;

    request.user = {
      id: sub,
      name,
    };

    return next();
  } catch {
    throw new AppError(Error.InvalidJWT, 401);
  }
}
