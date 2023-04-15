import { FindOneAccessProfileDTO } from '@/modules/access-profiles/dtos/find-one-access-profile.dto';
import { CreatePermissionDTO } from '@/modules/permissions/dtos/create-permission.dto';
import { FindManyPermissionDTO } from '../dtos/find-many-permission.dto';
import { Permission } from '../infra/typeorm/entities/permission.entity';

export interface PermissionsRepositoryInterface {
  create(data: CreatePermissionDTO): Promise<Permission>;
  findOne(data: FindOneAccessProfileDTO): Promise<Permission | null>;
  findMany(data: FindManyPermissionDTO): Promise<[Permission[], number]>;
  findByIds(ids: string[]): Promise<Permission[] | undefined>;
}
