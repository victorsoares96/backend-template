import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { EGenericError } from '@shared/utils/enums/errors.enum';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { EUserStatus } from '../utils/enums/user.enum';
import { CreateUserService } from './create-user.service';
import { FindOneUserService } from './find-one-user.service';

let createUser: CreateUserService;
let findUser: FindOneUserService;

describe('FindOneUser', () => {
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
    findUser = new FindOneUserService(fakeUsersRepository);
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfilesRepository,
    );
  });

  it('should not allow the search if no filter is sent', async () => {
    expect(
      await findUser
        .execute({ username: '' })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EGenericError.MissingFilters));
    expect(
      await findUser
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .execute({})
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EGenericError.MissingFilters));
  });

  it('should be able to search and return only one user', async () => {
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

    const userFound = await findUser.execute({
      username: 'foobar',
    });

    expect(userFound).toEqual(user);
  });
});
