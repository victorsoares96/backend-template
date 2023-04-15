import { AccessProfile } from '../infra/typeorm/entities/access-profile.entity';
import { CreateAccessProfileDTO } from '../dtos/create-access-profile.dto';
import { AccessProfileDTO } from '../dtos/access-profile.dto';
import { FindManyAccessProfileDTO } from '../dtos/find-many-access-profile.dto';
import { FindOneAccessProfileDTO } from '../dtos/find-one-access-profile.dto';

export interface FindOptions {
  withDeleted?: boolean;
}
export interface AccessProfilesRepositoryInterface {
  create(data: CreateAccessProfileDTO): Promise<AccessProfile>;
  findOne(data: FindOneAccessProfileDTO): Promise<AccessProfile | null>;
  findMany(data: FindManyAccessProfileDTO): Promise<[AccessProfile[], number]>;
  findByIds(
    ids: string[],
    options?: FindOptions,
  ): Promise<AccessProfile[] | null>;
  update(data: AccessProfileDTO[]): Promise<AccessProfile[]>;
  recover(data: AccessProfileDTO[]): Promise<AccessProfile[]>;
  remove(data: AccessProfileDTO[]): Promise<AccessProfile[]>;
  softRemove(data: AccessProfileDTO[]): Promise<AccessProfile[]>;
}
