import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { UsersRepositoryMethods } from '../repositories/UsersRepositoryMethods';
import { ESessionError } from '../utils/enums/e-errors';
import { HashProviderMethods } from '../providers/HashProvider/models/HashProviderMethods';
import { RefreshTokenRepositoryMethods } from '../repositories/RefreshTokenRepositoryMethods';
import { RefreshTokenDTO } from '../dtos/RefreshTokenDTO';
import { TokenProviderMethods } from '../providers/TokenProvider';

export interface Request {
  username: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
  refreshToken: RefreshTokenDTO;
}

@injectable()
export class SessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryMethods,
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: RefreshTokenRepositoryMethods,
    @inject('HashProvider')
    private hashProvider: HashProviderMethods,
    @inject('TokenProvider')
    private tokenProvider: TokenProviderMethods,
  ) {}

  public async execute({ username, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({ username });

    if (!user)
      throw new AppError(
        ESessionError.IncorrectUsernamePasswordCombination,
        401,
      );

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched)
      throw new AppError(
        ESessionError.IncorrectUsernamePasswordCombination,
        401,
      );

    const token = await this.tokenProvider.generate(user.fullName, user.id);

    const refreshToken = await this.refreshTokensRepository.create({
      user,
    });

    user.lastAccess = new Date().toISOString();
    await this.usersRepository.update([user]);

    // @ts-ignore
    delete user.password;

    return { user, token, refreshToken };
  }
}
