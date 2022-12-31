import { FakePermissionsRepository } from '@/modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@/modules/permissions/services/create-permission.service';
import { AppError } from '@/shared/errors/app-error.error';
import { AccessProfile } from '../infra/typeorm/entities/access-profile.entity';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { EAccessProfileError } from '../utils/enums/errors.enum';
import { EAccessProfileStatus } from '../utils/enums/status.enum';
import { CreateAccessProfileService } from './create-access-profile.service';
import { FindOneAccessProfileService } from './find-one-access-profile.service';
import { SoftRemoveAccessProfileService } from './soft-remove-access-profile.service';

let fakeAccessProfilesRepository: FakeAccessProfileRepository;
let createAccessProfile: CreateAccessProfileService;
let softRemoveAccessProfile: SoftRemoveAccessProfileService;
let findOneAccessProfile: FindOneAccessProfileService;

describe('SoftRemoveAccessProfile', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    fakeAccessProfilesRepository = new FakeAccessProfileRepository();
    createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
    softRemoveAccessProfile = new SoftRemoveAccessProfileService(
      fakeAccessProfilesRepository,
    );
    findOneAccessProfile = new FindOneAccessProfileService(
      fakeAccessProfilesRepository,
    );
  });

  it('should not be able to recover the access profile if the id is not provided', async () => {
    expect(
      await softRemoveAccessProfile
        .execute({
          ids: '',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.IdIsRequired));
  });

  it('should not be able to recover the access profile if it is not found', async () => {
    expect(
      await softRemoveAccessProfile
        .execute({
          ids: '1',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });

  it('should be able to soft remove a access profile', async () => {
    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    await softRemoveAccessProfile.execute({
      ids: '1',
    });

    const accessProfile = (await findOneAccessProfile.execute({
      name: 'Admin',
    })) as AccessProfile;

    expect(accessProfile.status).toBe(EAccessProfileStatus.Deleted);
  });
});
