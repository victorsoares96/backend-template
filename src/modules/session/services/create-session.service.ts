import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/app-error.error';

import { User } from '@modules/users/infra/typeorm/entities/user.entity';
import { Error } from '@modules/session/utils/enums/errors.enum';
import { UsersRepositoryInterface } from '@modules/users/repositories/user-repository.interface';
import { HashProviderInterface } from '../providers/hash/interfaces/hash-provider.interface';
import { TokenProviderInterface } from '../providers/token';
import { SessionDTO } from '../dtos/session.dto';
import { SessionRepositoryInterface } from '../repositories/session-repository.interface';

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
    private usersRepository: UsersRepositoryInterface,
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: SessionRepositoryInterface,
    @inject('HashProvider')
    private hashProvider: HashProviderInterface,
    @inject('TokenProvider')
    private tokenProvider: TokenProviderInterface,
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
