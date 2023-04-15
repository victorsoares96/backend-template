import { FakeAccessProfileRepository } from '@/modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@/modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@/modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@/modules/permissions/services/create-permission.service';
import { AppError } from '@/shared/errors/app-error.error';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { EUserError } from '../utils/enums/errors.enum';
import { EUserStatus } from '../utils/enums/user.enum';
import { CreateUserService } from './create-user.service';
import { InactiveUserService } from './inactive-user.service';

let createUser: CreateUserService;
let inactiveUser: InactiveUserService;

describe('InactiveUser', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    const fakeAccessProfilesRepository = new FakeAccessProfileRepository();
    const createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    const fakeUsersRepository = new FakeUsersRepository();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfilesRepository,
    );
    inactiveUser = new InactiveUserService(fakeUsersRepository);
  });

  it('should be able to inactive a user', async () => {
    const user = await createUser.execute({
      firstName: 'Foo',
      lastName: 'Bar',
      status: EUserStatus.Active,
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
      lastAccess: '2020-01-01',
      accessProfileId: '1',
      avatar: '',
      username: 'foobar',
      email: 'john@doe.com',
      password: 'Password123',
    });

    await inactiveUser.execute({
      ids: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(user.status).toBe(EUserStatus.Inactive);
  });

  it('should not be able to inactive a user if the same not exists', async () => {
    expect(
      await inactiveUser
        .execute({
          ids: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.NotFound));
  });

  it('should not be able to inactive a access profile if the same is already inactive', async () => {
    await createUser.execute({
      firstName: 'Foo',
      lastName: 'Bar',
      status: EUserStatus.Active,
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
      lastAccess: '2020-01-01',
      accessProfileId: '1',
      avatar: '',
      username: 'foobar',
      email: 'john@doe.com',
      password: 'Password123',
    });

    await inactiveUser.execute({
      ids: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(
      await inactiveUser
        .execute({
          ids: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.SomeAlreadyInactive));
  });
});
