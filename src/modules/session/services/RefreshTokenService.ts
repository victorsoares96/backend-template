import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import dayjs from 'dayjs';
import { ESessionError } from '../../users/utils/enums/e-errors';
import { RefreshTokenRepositoryMethods } from '../repositories/RefreshTokenRepositoryMethods';
import { TokenProviderMethods } from '../providers/TokenProvider';
import { RefreshTokenDTO } from '../dtos/RefreshTokenDTO';

export interface Request {
  refreshToken: string;
}

interface Response {
  token: string;
  refreshToken: RefreshTokenDTO;
}

@injectable()
export class RefreshTokenService {
  constructor(
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: RefreshTokenRepositoryMethods,
    @inject('TokenProvider')
    private tokenProvider: TokenProviderMethods,
  ) {}

  public async execute(data: Request): Promise<Response> {
    const refreshToken = await this.refreshTokensRepository.findOne({
      id: data.refreshToken,
    });

    if (!refreshToken) {
      throw new AppError(ESessionError.InvalidRefreshToken);
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn),
    );

    const token = await this.tokenProvider.generate(
      refreshToken.user.fullName,
      refreshToken.user.id,
    );

    if (refreshTokenExpired) {
      await this.refreshTokensRepository.remove(refreshToken);

      const newRefreshToken = await this.refreshTokensRepository.create({
        user: refreshToken.user,
      });

      return {
        token,
        refreshToken: newRefreshToken,
      };
    }

    return {
      token,
      refreshToken: {
        id: refreshToken.id,
        expiresIn: refreshToken.expiresIn,
        userId: refreshToken.user.id,
      },
    };
  }
}
