import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { EUserError } from '../utils/enums/errors.enum';
import { EUserStatus } from '../utils/enums/user.enum';
import { CreateUserService } from './create-user.service';
import { FindOneUserService } from './find-one-user.service';
import { RemoveUserService } from './remove-user.service';

let removeUser: RemoveUserService;
let findOneUser: FindOneUserService;

describe('RemoveUser', () => {
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
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfilesRepository,
    );
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
    removeUser = new RemoveUserService(fakeUsersRepository);
    findOneUser = new FindOneUserService(fakeUsersRepository);
  });

  it('should not be able to remove the user if the id is not provided', async () => {
    expect(
      await removeUser
        .execute({ ids: '' })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.IdIsRequired));
  });

  it('should not be able to remove the user if it is not found', async () => {
    expect(
      await removeUser
        .execute({ ids: '2' })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.NotFound));
  });

  it('should be able to remove a user', async () => {
    await removeUser.execute({ ids: '1' });

    expect(await findOneUser.execute({ username: 'foobar' })).toEqual(null);
  });
});
