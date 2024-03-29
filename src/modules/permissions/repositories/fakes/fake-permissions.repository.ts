import { validate } from 'class-validator';

import { CreatePermissionDTO } from '@/modules/permissions/dtos/create-permission.dto';
import { PermissionsRepositoryInterface } from '@/modules/permissions/repositories/permissions-repository.interface';
import { AppError } from '@/shared/errors/app-error.error';
import { Permission } from '@/modules/permissions/infra/typeorm/entities/permission.entity';
import { FindOnePermissionDTO } from '@/modules/permissions/dtos/find-one-permission.dto';
import { FindManyPermissionDTO } from '@/modules/permissions/dtos/find-many-permission.dto';

export class FakePermissionsRepository
  implements PermissionsRepositoryInterface
{
  private permissions: Permission[] = [];

  public async create({ name }: CreatePermissionDTO): Promise<Permission> {
    const permission = new Permission();

    Object.assign(permission, { id: '1', name });

    const [error] = await validate(permission, {
      stopAtFirstError: true,
    });

    if (error && error.constraints) {
      const [message] = Object.values(error.constraints);
      throw new AppError(message);
    }

    this.permissions.push(permission);

    return permission;
  }

  public findOne(filters: FindOnePermissionDTO): Promise<Permission | null> {
    return new Promise(resolve => {
      const permission = this.permissions.find(item => {
        for (const filter in filters) {
          if (
            // @ts-ignore
            item[filter] === undefined ||
            // @ts-ignore
            !item[filter].includes(filters[filter])
          )
            return false;
        }
        return true;
      });

      resolve(permission || null);
    });
  }

  public findMany(
    filters: FindManyPermissionDTO,
  ): Promise<[Permission[], number]> {
    return new Promise(resolve => {
      const permissions = this.permissions.filter(item => {
        for (const filter in filters) {
          if (
            // @ts-ignore
            item[filter] === undefined ||
            // @ts-ignore
            !item[filter].includes(filters[filter])
          )
            return false;
        }
        return true;
      });

      resolve([permissions, permissions.length]);
    });
  }

  public async findByIds(ids: string[]): Promise<Permission[] | undefined> {
    const findPermissions = ids.map(id =>
      this.permissions.find(permission => permission.id === id),
    );
    if (findPermissions.some(el => !el)) return undefined;
    return findPermissions as Permission[];
  }
}
