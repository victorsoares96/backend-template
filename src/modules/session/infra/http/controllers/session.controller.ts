import { Request, Response } from 'express';
import { container } from 'tsyringe';

import {
  CreateSessionService,
  Request as CreateSessionRequest,
} from '@modules/session/services/create-session.service';

import {
  RefreshSessionService,
  Request as RefreshSessionRequest,
} from '@modules/session/services/refresh-session.service';

export class SessionController {
  public async authenticate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { username, password } = request.body as CreateSessionRequest;

    const createSession = container.resolve(CreateSessionService);
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
    const { refreshToken } = request.body as RefreshSessionRequest;

    const generateRefreshSession = container.resolve(RefreshSessionService);
    const session = await generateRefreshSession.execute({ refreshToken });

    return response.json(session);
  }
}
