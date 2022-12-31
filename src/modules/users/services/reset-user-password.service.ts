import { validate } from 'class-validator';
import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/errors/app-error.error';
import { User } from '@/modules/users/infra/typeorm/entities/user.entity';
import { EUserError } from '@/modules/users/utils/enums/errors.enum';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';
import { HashProviderInterface } from '../../session/providers/hash/interfaces/hash-provider.interface';

interface Request {
  id: string;
  currentPassword: string;
  newPassword: string;
}

@injectable()
export class ResetUserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
    @inject('HashProvider')
    private hashProvider: HashProviderInterface,
  ) {}

  public async execute({
    id,
    currentPassword,
    newPassword,
  }: Request): Promise<void> {
    if (!id) throw new AppError(EUserError.IsRequired);
    if (!currentPassword || !newPassword)
      throw new AppError(EUserError.CurrentOrNewPasswordRequired);

    const user = await this.usersRepository.findOne({ id });

    if (!user) throw new AppError(EUserError.NotFound);

    const passwordMatched = await this.hashProvider.compareHash(
      currentPassword,
      user.password,
    );

    if (!passwordMatched) throw new AppError(EUserError.IncorrectPassword, 401);

    const hashPassword = await this.hashProvider.generateHash(newPassword);

    const updatedUser: User = {
      ...user,
      password: hashPassword,
    };

    const [error] = await validate(updatedUser, {
      stopAtFirstError: true,
    });
    if (error && error.constraints) {
      const [message] = Object.values(error.constraints);
      throw new AppError(message);
    }

    await this.usersRepository.update([updatedUser]);
  }
}
