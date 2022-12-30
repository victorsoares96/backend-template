import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/app-error.error';
import { EAccessProfileError } from '@modules/access-profiles/utils/enums/errors.enum';

import { AccessProfilesRepositoryInterface } from '@modules/access-profiles/repositories/access-profiles-repository.interface';
import { User } from '../infra/typeorm/entities/user.entity';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';
import { EUserError } from '../utils/enums/errors.enum';
import { isValidEmail } from '../utils/is-valid-email.util';
import { isValidPassword } from '../utils/is-valid-password.util';

export interface Request {
  firstName: string;
  lastName: string;
  status: number;
  createdById: string;
  createdByName: string;
  updatedById: string;
  updatedByName: string;
  lastAccess: string;
  accessProfileId: string;
  avatar: string;
  username: string;
  email: string;
  password: string;
}

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute(data: Request): Promise<User> {
    const { accessProfileId, firstName, lastName, username, email, password } =
      data;

    if (!firstName) throw new AppError(EUserError.FirstNameIsRequired);
    if (!lastName) throw new AppError(EUserError.LastNameIsRequired);
    if (!username) throw new AppError(EUserError.UsernameIsRequired);
    if (!email) throw new AppError(EUserError.EmailIsRequired);

    if (username.length < 5) {
      throw new AppError(EUserError.UsernameTooShort);
    }

    if (username.length > 15) {
      throw new AppError(EUserError.UsernameTooLong);
    }

    if (!isValidEmail(email)) {
      throw new AppError(EUserError.EmailIsInvalid);
    }

    if (!isValidPassword(password)) {
      throw new AppError(
        EUserError.PasswordMustBeAtLeastEightCharsOneUpperCaseAndOneNumber,
      );
    }

    if (!accessProfileId) throw new AppError(EAccessProfileError.IsRequired);

    const accessProfile = await this.accessProfilesRepository.findOne({
      id: accessProfileId,
    });

    if (!accessProfile) throw new AppError(EAccessProfileError.NotFound);

    const userExists = await this.usersRepository.findOne({
      username,
    });

    if (userExists) throw new AppError(EUserError.AlreadyExist);

    const user = this.usersRepository.create({
      ...data,
      accessProfile,
    });

    return user;
  }
}
