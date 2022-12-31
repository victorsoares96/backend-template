import { validate } from 'class-validator';
import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/errors/app-error.error';
import { User } from '@/modules/users/infra/typeorm/entities/user.entity';
import { AccessProfilesRepositoryInterface } from '@/modules/access-profiles/repositories/access-profiles-repository.interface';
import { EAccessProfileError } from '@/modules/access-profiles/utils/enums/errors.enum';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';
import { EUserError } from '../utils/enums/errors.enum';

export interface Request {
  id: string;
  firstName?: string;
  lastName?: string;
  status?: number;
  updatedById: string;
  updatedByName: string;
  email?: string;
  username?: string;
  accessProfileId?: string;
}

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute(userData: Request): Promise<User> {
    const { id, accessProfileId } = userData;

    if (!id) throw new AppError(EUserError.IdIsRequired);
    if (!accessProfileId) throw new AppError(EAccessProfileError.IdIsRequired);

    const user = await this.usersRepository.findOne({ id });
    if (!user) throw new AppError(EUserError.NotFound);

    const accessProfile = await this.accessProfilesRepository.findOne({
      id: accessProfileId,
    });
    if (!accessProfile) throw new AppError(EAccessProfileError.NotFound);

    delete userData.accessProfileId;

    const [error] = await validate(
      {
        ...user,
        ...userData,
        accessProfile,
      },
      {
        stopAtFirstError: true,
      },
    );
    if (error && error.constraints) {
      const [message] = Object.values(error.constraints);
      throw new AppError(message);
    }

    const [updatedUser] = await this.usersRepository.update([
      {
        ...user,
        ...userData,
        accessProfile,
      },
    ]);

    return updatedUser;
  }
}
