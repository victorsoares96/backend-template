import { Request, Response } from 'express';
import { container } from 'tsyringe';

import {
  CreateUserService,
  Request as CreateRequest,
} from '@modules/users/services/create-user.service';
import { EUserStatus } from '@modules/users/utils/enums/user.enum';
import { InactiveUserService } from '@modules/users/services/inactive-user.service';
import { RecoverUserService } from '@modules/users/services/recover-user.service';
import { SoftRemoveUserService } from '@modules/users/services/soft-remove-user.service';
import { RemoveUserService } from '@modules/users/services/remove-user.service';
import { UpdateUserService } from '@modules/users/services/update-user.service';
import { UpdateUserAvatarService } from '@modules/users/services/update-user-avatar.service';
import { AppError } from '@shared/errors/app-error.error';
import { EGenericError } from '@shared/utils/enums/errors.enum';
import { ResetUserPasswordService } from '@modules/users/services/reset-user-password.service';
import { FindManyUserDTO } from '@modules/users/dtos/find-many-user.dto';
import { FindManyUserService } from '@modules/users/services/find-many-user.service';

export class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      avatar,
      accessProfileId,
    } = request.body as CreateRequest;

    // const { name, id } = request.user;

    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      firstName,
      lastName,
      username,
      email,
      password,
      status: EUserStatus.Active,
      avatar,
      accessProfileId,
      createdById: '0',
      createdByName: 'name',
      updatedById: '0',
      updatedByName: 'name',
      lastAccess: '',
    });

    return response.json(user);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const filters = request.body as FindManyUserDTO;

    const findUsers = container.resolve(FindManyUserService);
    const users = await findUsers.execute(filters);

    return response.json(users);
  }

  public async inactive(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;
    const { id: userId, name: userName } = request.user;

    const inactiveUsers = container.resolve(InactiveUserService);

    await inactiveUsers.execute({
      ids,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.send();
  }

  public async recover(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;
    const { id: userId, name: userName } = request.user;

    const recoverUsers = container.resolve(RecoverUserService);

    await recoverUsers.execute({
      ids,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.send();
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { ids } = request.body;

    const removeUsers = container.resolve(RemoveUserService);

    await removeUsers.execute({
      ids,
    });

    return response.send();
  }

  public async softRemove(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;

    const softRemoveUsers = container.resolve(SoftRemoveUserService);

    await softRemoveUsers.execute({
      ids,
    });

    return response.send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: userId, name: userName } = request.user;
    const { id, firstName, lastName, email, username, accessProfileId } =
      request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      firstName,
      lastName,
      email,
      username,
      accessProfileId,
      updatedById: userId,
      updatedByName: userName,
    });

    return response.json(user);
  }

  public async updateAvatar(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    if (!request.file?.filename)
      throw new AppError(EGenericError.AvatarFilenameRequired, 401);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    // @ts-ignore
    delete user.password;

    return response.json(user);
  }

  public async resetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, currentPassword, newPassword } = request.body;

    const resetPassword = container.resolve(ResetUserPasswordService);

    await resetPassword.execute({
      id,
      currentPassword,
      newPassword,
    });

    return response.send();
  }
}
