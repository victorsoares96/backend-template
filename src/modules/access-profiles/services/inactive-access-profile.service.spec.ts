import { FakePermissionsRepository } from '@/modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@/modules/permissions/services/create-permission.service';
import { AppError } from '@/shared/errors/app-error.error';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { EAccessProfileError } from '../utils/enums/errors.enum';
import { EAccessProfileStatus } from '../utils/enums/status.enum';
import { CreateAccessProfileService } from './create-access-profile.service';
import { InactiveAccessProfileService } from './inactive-access-profile.service';

let fakeAccessProfilesRepository: FakeAccessProfileRepository;
let createAccessProfile: CreateAccessProfileService;
let inactiveAccessProfile: InactiveAccessProfileService;

describe('InactiveAccessProfile', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    fakeAccessProfilesRepository = new FakeAccessProfileRepository();
    inactiveAccessProfile = new InactiveAccessProfileService(
      fakeAccessProfilesRepository,
    );
    createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
  });

  it('should be able to inactive a access profile', async () => {
    const accessProfile = await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    await inactiveAccessProfile.execute({
      ids: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(accessProfile.status).toBe(EAccessProfileStatus.Inactive);
  });

  it('should not be able to inactive a access profile if the same not exists', async () => {
    expect(
      await inactiveAccessProfile
        .execute({
          ids: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });

  it('should not be able to inactive a access profile if the same is already inactive', async () => {
    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    await inactiveAccessProfile.execute({
      ids: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(
      await inactiveAccessProfile
        .execute({
          ids: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.AlreadyInactive));
  });
});
