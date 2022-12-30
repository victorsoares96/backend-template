import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { User } from '../infra/typeorm/entities/user.entity';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { CreateUserService } from './create-user.service';
import { FindManyUserService } from './find-many-user.service';
import { EUserStatus } from '../utils/enums/user.enum';

let createUser: CreateUserService;
let findUsers: FindManyUserService;
let users: User[] = [];

describe('FindManyUser', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    const fakeAccessProfileRepository = new FakeAccessProfileRepository();
    const createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfileRepository,
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
    findUsers = new FindManyUserService(fakeUsersRepository);
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfileRepository,
    );
  });

  afterEach(() => {
    users = [];
  });

  it('should be able to search a users', async () => {
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
    users.push(user);

    const [findManyUsers, countUsers] = await findUsers.execute({
      username: 'foobar',
    });

    const expectedUsers = users;
    expect(findManyUsers).toEqual(expectedUsers);
    expect(countUsers).toBe(1);
  });
});
