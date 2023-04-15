import { getRepository, ILike, In, Repository } from 'typeorm';

import {
  AccessProfilesRepositoryInterface,
  FindOptions,
} from '@/modules/access-profiles/repositories/access-profiles-repository.interface';
import { CreateAccessProfileDTO } from '@/modules/access-profiles/dtos/create-access-profile.dto';
import { AccessProfileDTO } from '@/modules/access-profiles/dtos/access-profile.dto';
import { FindManyAccessProfileDTO } from '@/modules/access-profiles/dtos/find-many-access-profile.dto';
import { FindOneAccessProfileDTO } from '@/modules/access-profiles/dtos/find-one-access-profile.dto';
import { AccessProfile } from '../entities/access-profile.entity';

export class AccessProfileRepository
  implements AccessProfilesRepositoryInterface
{
  private ormRepository: Repository<AccessProfile>;

  constructor() {
    this.ormRepository = getRepository(AccessProfile);
  }

  public async create({
    name,
    permissions,
    description,
    createdById,
    createdByName,
    updatedById,
    updatedByName,
  }: CreateAccessProfileDTO) {
    const accessProfile = this.ormRepository.create({
      name,
      description,
      permissions,
      createdById,
      createdByName,
      updatedById,
      updatedByName,
    });

    await this.ormRepository.save(accessProfile);
    return accessProfile;
  }

  public async findOne(
    filters: FindOneAccessProfileDTO,
  ): Promise<AccessProfile | null> {
    const { isDeleted = false } = filters;

    const onlyValueFilters = Object.entries(filters).filter(
      ([, value]) => value,
    );
    const query = Object.fromEntries(
      onlyValueFilters,
    ) as FindOneAccessProfileDTO;

    delete query.isDeleted;

    const accessProfile = await this.ormRepository.findOne({
      where: [{ ...query }],
      loadEagerRelations: true,
      withDeleted: isDeleted,
    });

    if (!accessProfile) return null;
    return accessProfile;
  }

  public async findMany(
    filters: FindManyAccessProfileDTO,
  ): Promise<[AccessProfile[], number]> {
    const {
      name = '',
      description = '',
      isDeleted = false,
      offset = 0,
      isAscending = false,
      limit = 20,
    } = filters;

    const onlyValueFilters = Object.entries(filters).filter(
      ([, value]) => value,
    );
    const query = Object.fromEntries(
      onlyValueFilters,
    ) as FindManyAccessProfileDTO;

    delete query.isDeleted;
    delete query.offset;
    delete query.isAscending;
    delete query.limit;

    const accessProfiles = await this.ormRepository.findAndCount({
      where: [
        {
          ...query,
          name: ILike(`%${name}%`),
          description: ILike(`%${description}%`),
        },
      ],
      loadEagerRelations: true,
      withDeleted: isDeleted,
      take: limit,
      skip: offset,
      order: { name: isAscending ? 'ASC' : 'DESC' },
    });

    return accessProfiles;
  }

  public async findByIds(
    ids: string[],
    options?: FindOptions,
  ): Promise<AccessProfile[] | null> {
    const { withDeleted = false } = options || {};

    const findAccessProfiles = await this.ormRepository.find({
      where: { id: In(ids) },
      withDeleted,
    });

    if (findAccessProfiles.length === ids.length) return findAccessProfiles;
    return null;
  }

  public async update(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = await this.ormRepository.save(data);
    return accessProfiles;
  }

  public async recover(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = await this.ormRepository.recover(data);
    return accessProfiles;
  }

  public async remove(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = await this.ormRepository.remove(data);
    return accessProfiles;
  }

  public async softRemove(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = await this.ormRepository.softRemove(data);
    return accessProfiles;
  }
}
