import { AccessProfilesRepositoryInterface } from '@modules/access-profiles/repositories/access-profiles-repository.interface';
import { CreateAccessProfileDTO } from '@modules/access-profiles/dtos/create-access-profile.dto';
import { AccessProfile } from '@modules/access-profiles/infra/typeorm/entities/access-profile.entity';
import { FindOneAccessProfileDTO } from '@modules/access-profiles/dtos/find-one-access-profile.dto';
import { AccessProfileDTO } from '@modules/access-profiles/dtos/access-profile.dto';
import { EAccessProfileStatus } from '@modules/access-profiles/utils/enums/status.enum';
import { FindManyAccessProfileDTO } from '@modules/access-profiles/dtos/find-many-access-profile.dto';

export class FakeAccessProfileRepository
  implements AccessProfilesRepositoryInterface
{
  private accessProfiles: AccessProfile[] = [];

  public async create({
    name,
    permissions,
    description,
    createdById,
    createdByName,
    updatedById,
    updatedByName,
  }: CreateAccessProfileDTO): Promise<AccessProfile> {
    const accessProfile = new AccessProfile();

    Object.assign(accessProfile, {
      id: '1',
      name,
      permissions,
      description,
      status: EAccessProfileStatus.Active,
      createdById,
      createdByName,
      updatedById,
      updatedByName,
    });

    this.accessProfiles.push(accessProfile);

    return accessProfile;
  }

  public findOne(
    filters: FindOneAccessProfileDTO,
  ): Promise<AccessProfile | null> {
    return new Promise(resolve => {
      const accessProfile = this.accessProfiles.find(item => {
        for (const filter in filters) {
          if (
            // @ts-ignore
            item[filter] === undefined ||
            // @ts-ignore
            !item[filter].includes(filters[filter])
          ) {
            return false;
          }
        }
        return true;
      });

      resolve(accessProfile || null);
    });
  }

  public findMany(
    filters: FindManyAccessProfileDTO,
  ): Promise<[AccessProfile[], number]> {
    return new Promise(resolve => {
      const accessProfiles = this.accessProfiles.filter(item => {
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

      resolve([accessProfiles, accessProfiles.length]);
    });
  }

  public async findByIds(ids: string[]): Promise<AccessProfile[] | null> {
    const findAccessProfiles = ids.map(id =>
      this.accessProfiles.find(accessProfile => accessProfile.id === id),
    );
    if (findAccessProfiles.some(el => !el)) return null;
    return findAccessProfiles as AccessProfile[];
  }

  public async update(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = data;

    accessProfiles.forEach(accessProfile => {
      const index = this.accessProfiles.findIndex(
        item => item.id === accessProfile.id,
      );

      this.accessProfiles[index] = accessProfile;
    });

    return this.accessProfiles;
  }

  public async recover(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfiles = data;

    accessProfiles.forEach(accessProfile => {
      const index = this.accessProfiles.findIndex(
        item => item.id === accessProfile.id,
      );

      this.accessProfiles[index] = {
        ...this.accessProfiles[index],
        status: EAccessProfileStatus.Active,
      };
    });

    return this.accessProfiles;
  }

  public async remove(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfilesId = data.map(accessProfile => accessProfile.id);
    const accessProfiles = this.accessProfiles.filter(
      accessProfile => !accessProfilesId.includes(accessProfile.id),
    );

    this.accessProfiles = accessProfiles;
    return data;
  }

  public async softRemove(data: AccessProfileDTO[]): Promise<AccessProfile[]> {
    const accessProfilesId = data.map(id => id.id);
    const findAccessProfiles = this.accessProfiles.filter(accessProfile =>
      accessProfilesId.includes(accessProfile.id),
    );
    const softRemoveAccessProfiles = findAccessProfiles.map(accessProfile => {
      return { ...accessProfile, status: EAccessProfileStatus.Deleted };
    });

    this.accessProfiles = softRemoveAccessProfiles;
    return softRemoveAccessProfiles;
  }
}
