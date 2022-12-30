import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { EAccessProfileError } from '@modules/access-profiles/utils/enums/errors.enum';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { User } from '../infra/typeorm/entities/user.entity';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { EUserError } from '../utils/enums/errors.enum';
import { EUserStatus } from '../utils/enums/user.enum';
import { CreateUserService } from './create-user.service';
import { FindOneUserService } from './find-one-user.service';
import { UpdateUserService } from './update-user.service';

let createUser: CreateUserService;
let updateUser: UpdateUserService;
let findOneUser: FindOneUserService;

describe('UpdateUser', () => {
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
    updateUser = new UpdateUserService(
      fakeUsersRepository,
      fakeAccessProfilesRepository,
    );
    findOneUser = new FindOneUserService(fakeUsersRepository);
  });

  it('should be able to update a user', async () => {
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

    await updateUser.execute({
      id: '1',
      username: 'foobar_updated',
      accessProfileId: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    const user = (await findOneUser.execute({
      id: '1',
    })) as User;

    expect(user.username).toBe('foobar_updated');
  });

  it('should not be able to update a user if the id are not informed', async () => {
    expect(
      await updateUser
        .execute({
          id: '',
          username: 'foobar_updated',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.IdIsRequired));
  });

  it('should not be able to update a user if the access profile informed does not exist', async () => {
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

    expect(
      await updateUser
        .execute({
          id: '1',
          username: 'foobar_updated',
          accessProfileId: '2',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });
});
