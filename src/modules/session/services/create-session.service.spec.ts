import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/fake-user.repository';
import { CreateUserService } from '@modules/users/services/create-user.service';
import { EUserStatus } from '@modules/users/utils/enums/user.enum';
import { Error } from '@modules/session/utils/enums/errors.enum';
import { AppError } from '@shared/errors/app-error.error';
import { FakeHashProvider } from '../providers/hash';
import { FakeTokenProvider } from '../providers/token';
import { FakeSessionRepository } from '../repositories/fakes/fake-session.repository';
import { CreateSessionService } from './create-session.service';

let fakeSessionRepository: FakeSessionRepository;
let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;
let createSession: CreateSessionService;

describe('CreateSessionService', () => {
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

    fakeSessionRepository = new FakeSessionRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfileRepository,
    );

    fakeHashProvider = new FakeHashProvider();
    fakeTokenProvider = new FakeTokenProvider();
    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeSessionRepository,
      fakeHashProvider,
      fakeTokenProvider,
    );
  });

  it('should be able to authenticate', async () => {
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

    const response = await createSession.execute({
      username: 'foobar',
      password: 'Password123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate if provide incorrect username and password combination', async () => {
    expect(
      await createSession
        .execute({
          username: 'johndoe',
          password: 'Password123',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(Error.IncorrectUsernamePasswordCombination));
  });
});
