import { container } from 'tsyringe';

import { PermissionsRepositoryInterface } from '@/modules/permissions/repositories/permissions-repository.interface';
import { PermissionRepository } from '@/modules/permissions/infra/typeorm/repositories/permission.repository';

import { AccessProfilesRepositoryInterface } from '@/modules/access-profiles/repositories/access-profiles-repository.interface';
import { AccessProfileRepository } from '@/modules/access-profiles/infra/typeorm/repositories/access-profile.repository';

import { UsersRepositoryInterface } from '@/modules/users/repositories/user-repository.interface';
import { UserRepository } from '@/modules/users/infra/typeorm/repositories/user.repository';

export class Tsyringe {
  constructor() {
    container.registerSingleton<PermissionsRepositoryInterface>(
      'PermissionsRepository',
      PermissionRepository,
    );

    container.registerSingleton<AccessProfilesRepositoryInterface>(
      'AccessProfileRepository',
      AccessProfileRepository,
    );

    container.registerSingleton<UsersRepositoryInterface>(
      'UsersRepository',
      UserRepository,
    );
  }
}
