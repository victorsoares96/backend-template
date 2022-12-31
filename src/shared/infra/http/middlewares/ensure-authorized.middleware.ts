import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { injectable, inject, container } from 'tsyringe';

import authConfig from '@/config/auth.config';
import { AppError } from '@/shared/errors/app-error.error';
import { Permission } from '@/modules/permissions/infra/typeorm/entities/permission.entity';
import { UsersRepositoryInterface } from '@/modules/users/repositories/user-repository.interface';
import { AccessProfilesRepositoryInterface } from '@/modules/access-profiles/repositories/access-profiles-repository.interface';
import { EUserError as UserError } from '@/modules/users/utils/enums/errors.enum';
import { Error as SessionError } from '@/modules/session/utils/enums/errors.enum';
import { EAccessProfileError } from '@/modules/access-profiles/utils/enums/errors.enum';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  name: string;
}

@injectable()
class Decoder {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async getPermissions(request: Request): Promise<Permission[]> {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new AppError(SessionError.MissingJWT, 401);

    const [, token] = authHeader.split(' ');

    const decoded = verify(token, authConfig.jwt.secret);
    const { sub: id } = decoded as TokenPayload;

    const user = await this.usersRepository.findOne({ id });

    if (!user) throw new AppError(UserError.NotFound);

    const accessProfile = await this.accessProfilesRepository.findOne({
      id: user.accessProfile.id,
    });

    if (!accessProfile) throw new AppError(EAccessProfileError.NotFound);

    return accessProfile.permissions;
  }
}

function is(routePermissions: string[]) {
  const ensureAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    return next();

    const decoder = container.resolve(Decoder);
    const permissions = await decoder.getPermissions(request);

    const userPermissions = permissions.map(
      (permission: Permission) => permission.name,
    );

    const isAuthorized = userPermissions.some(userPermission =>
      routePermissions.includes(userPermission),
    );

    if (isAuthorized) {
      return next();
    }

    throw new AppError(
      'You do not have permission to perform this action.',
      401,
    );
  };

  return ensureAuthorized;
}

export { is };
