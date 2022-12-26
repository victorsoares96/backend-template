import { Request, Response } from 'express';
import { container } from 'tsyringe';

import {
  SessionService,
  Request as SessionRequest,
} from '@modules/session/services/CreateSessionService';

import {
  RefreshTokenService,
  Request as RefreshTokenRequest,
} from '@modules/session/services/RefreshSessionService';

export class SessionController {
  public async authenticate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { username, password } = request.body as SessionRequest;

    const createSession = container.resolve(SessionService);
    const session = await createSession.execute({
      username,
      password,
    });

    return response.json(session);
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { refreshToken } = request.body as RefreshTokenRequest;

    const generateRefreshToken = container.resolve(RefreshTokenService);
    const token = await generateRefreshToken.execute({ refreshToken });

    return response.json(token);
  }
}
