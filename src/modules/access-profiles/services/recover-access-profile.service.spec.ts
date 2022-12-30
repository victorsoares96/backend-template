import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { EAccessProfileError } from '../utils/enums/errors.enum';
import { EAccessProfileStatus } from '../utils/enums/status.enum';
import { CreateAccessProfileService } from './create-access-profile.service';
import { InactiveAccessProfileService } from './inactive-access-profile.service';
import { RecoverAccessProfileService } from './recover-access-profile.service';

let fakeAccessProfilesRepository: FakeAccessProfileRepository;
let inactiveAccessProfile: InactiveAccessProfileService;
let recoverAccessProfile: RecoverAccessProfileService;
let createAccessProfile: CreateAccessProfileService;

describe('RecoverAccessProfile', () => {
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
    recoverAccessProfile = new RecoverAccessProfileService(
      fakeAccessProfilesRepository,
    );
    createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
  });

  it('should not be able to recover the access profile if the id is not provided', async () => {
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
      await recoverAccessProfile
        .execute({
          ids: '',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.IdIsRequired));
  });

  it('should not be able to recover the access profile if it is not found', async () => {
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
      await recoverAccessProfile
        .execute({
          ids: '2',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });

  it('should be able to recover a access profile', async () => {
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

    await recoverAccessProfile.execute({
      ids: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(accessProfile.status).toBe(EAccessProfileStatus.Active);
  });
});
