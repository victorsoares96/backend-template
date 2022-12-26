import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { Error } from '@modules/session/utils/enums/e-errors';
import { UsersRepositoryMethods } from '@modules/users/repositories/UsersRepositoryMethods';
import { HashProviderMethods } from '../providers/HashProvider/models/HashProviderMethods';
import { TokenProviderMethods } from '../providers/TokenProvider';
import { SessionDTO } from '../dtos/SessionDTO';
import { SessionRepositoryMethods } from '../repositories/SessionRepositoryMethods';

export interface Request {
  username: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
  refreshToken: SessionDTO;
}

@injectable()
export class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryMethods,
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: SessionRepositoryMethods,
    @inject('HashProvider')
    private hashProvider: HashProviderMethods,
    @inject('TokenProvider')
    private tokenProvider: TokenProviderMethods,
  ) {}

  public async execute({ username, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new AppError(Error.IncorrectUsernamePasswordCombination, 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError(Error.IncorrectUsernamePasswordCombination, 401);
    }

    const token = await this.tokenProvider.generate(user.fullName, user.id);

    await this.refreshTokensRepository.removeAllByUserId(user.id);

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
