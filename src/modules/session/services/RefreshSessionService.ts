import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import dayjs from 'dayjs';
import { Error } from '@modules/session/utils/enums/e-errors';
import { TokenProviderMethods } from '../providers/TokenProvider';
import { SessionDTO } from '../dtos/SessionDTO';
import { SessionRepositoryMethods } from '../repositories/SessionRepositoryMethods';

export interface Request {
  refreshToken: string;
}

interface Response {
  token: string;
  refreshToken: SessionDTO;
}

@injectable()
export class RefreshSessionService {
  constructor(
    @inject('SessionRepository')
    private sessionRepository: SessionRepositoryMethods,
    @inject('TokenProvider')
    private tokenProvider: TokenProviderMethods,
  ) {}

  public async execute(data: Request): Promise<Response> {
    const session = await this.sessionRepository.findOne({
      id: data.refreshToken,
    });

    if (!session) {
      throw new AppError(Error.MissingSession, 403);
    }

    const sessionExpired = dayjs().isAfter(dayjs.unix(session.expiresIn));

    if (sessionExpired) {
      await this.sessionRepository.remove(session);
      throw new AppError(Error.InvalidSession, 403);
    }

    const token = await this.tokenProvider.generate(
      session.user.fullName,
      session.user.id,
    );

    return {
      token,
      refreshToken: {
        id: session.id,
        expiresIn: session.expiresIn,
        userId: session.user.id,
      },
    };
  }
}
