import { getRepository, ILike, Repository } from 'typeorm';
import { validate } from 'class-validator';

import { CreatePermissionDTO } from '@/modules/permissions/dtos/create-permission.dto';
import { PermissionsRepositoryInterface } from '@/modules/permissions/repositories/permissions-repository.interface';
import { AppError } from '@/shared/errors/app-error.error';
import { FindOnePermissionDTO } from '@/modules/permissions/dtos/find-one-permission.dto';
import { FindManyPermissionDTO } from '@/modules/permissions/dtos/find-many-permission.dto';
import { Permission } from '../entities/permission.entity';

export class PermissionRepository implements PermissionsRepositoryInterface {
  private ormRepository: Repository<Permission>;

  constructor() {
    this.ormRepository = getRepository(Permission);
  }

  public async create({ name }: CreatePermissionDTO): Promise<Permission> {
    const permission = this.ormRepository.create({ name });

    const [error] = await validate(permission, {
      stopAtFirstError: true,
    });

    if (error && error.constraints) {
      const [message] = Object.values(error.constraints);
      throw new AppError(message);
    }

    await this.ormRepository.save(permission);

    return permission;
  }

  public async findOne(
    filters: FindOnePermissionDTO,
  ): Promise<Permission | null> {
    const onlyValueFilters = Object.entries(filters).filter(
      ([, value]) => value,
    );
    const query = Object.fromEntries(onlyValueFilters) as FindOnePermissionDTO;

    const permission = await this.ormRepository.findOne({
      where: [{ ...query }],
    });

    if (!permission) return null;
    return permission;
  }

  public async findMany(
    filters: FindManyPermissionDTO,
  ): Promise<[Permission[], number]> {
    const { name = '' } = filters;

    const onlyValueFilters = Object.entries(filters).filter(
      ([, value]) => value,
    );
    const query = Object.fromEntries(onlyValueFilters) as FindManyPermissionDTO;

    const accessProfiles = await this.ormRepository.findAndCount({
      where: [
        {
          ...query,
          name: ILike(`%${name}%`),
        },
      ],
    });

    return accessProfiles;
  }

  public async findByIds(ids: string[]): Promise<Permission[] | undefined> {
    const findPermissions = await this.ormRepository.findByIds(ids);
    if (findPermissions.length === ids.length) return findPermissions;
    return undefined;
  }
}
