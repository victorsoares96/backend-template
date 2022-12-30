import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/app-error.error';
import { EUserError } from '@modules/users/utils/enums/errors.enum';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';

interface Request {
  ids: string;
}

@injectable()
export class SoftRemoveUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  public async execute({ ids }: Request): Promise<void> {
    const usersId = ids.split(',');

    const users = await this.usersRepository.findByIds(usersId);

    if (!users) throw new AppError(EUserError.NotFound);

    await this.usersRepository.softRemove(users);
  }
}
