import { FakeAccessProfileRepository } from '@modules/accessProfiles/repositories/fakes/FakeAccessProfilesRepository';
import { CreateAccessProfileService } from '@modules/accessProfiles/services/CreateAccessProfileService';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/FakePermissionsRepository';
import { CreatePermissionService } from '@modules/permissions/services/CreatePermissionService';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { CreateUserService } from '@modules/users/services/CreateUserService';
import { EUserStatus } from '@modules/users/utils/enums/e-user';
import { Error } from '@modules/session/utils/enums/e-errors';
import { AppError } from '@shared/errors/AppError';
import dayjs from 'dayjs';
import { FakeHashProvider } from '../providers/HashProvider';
import { FakeTokenProvider } from '../providers/TokenProvider';
import { FakeSessionRepository } from '../repositories/fakes/FakeSessionRepository';
import { CreateSessionService } from './CreateSessionService';
import { RefreshSessionService } from './RefreshSessionService';

let fakeSessionRepository: FakeSessionRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;
let createSession: CreateSessionService;
let refreshSession: RefreshSessionService;

jest.useFakeTimers();

describe('SessionService', () => {
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

    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeAccessProfileRepository,
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

    fakeSessionRepository = new FakeSessionRepository();

    fakeHashProvider = new FakeHashProvider();
    fakeTokenProvider = new FakeTokenProvider();

    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeSessionRepository,
      fakeHashProvider,
      fakeTokenProvider,
    );

    refreshSession = new RefreshSessionService(
      fakeSessionRepository,
      fakeTokenProvider,
    );
  });

  it('should be able to refresh a session', async () => {
    const { refreshToken, token, user } = await createSession.execute({
      username: 'foobar',
      password: 'Password123',
    });

    const response = await refreshSession.execute({
      refreshToken: refreshToken.id,
    });

    expect(response.token).not.toEqual(token);
    expect(response.refreshToken.userId).toBe(user.id);
    expect(response.refreshToken.expiresIn).toBe(refreshToken.expiresIn);
    expect(response.refreshToken.id).toBe(refreshToken.id);
  });

  it('should not be able to refresh a session if session does not exist', async () => {
    expect(
      await refreshSession
        .execute({
          refreshToken: 'fake-session',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(Error.MissingSession));
  });

  it('should not be able to refresh a session if session has expired', async () => {
    const { refreshToken } = await createSession.execute({
      username: 'foobar',
      password: 'Password123',
    });

    const expiresIn = dayjs().add(30, 'day').unix().valueOf();
    const waitSessionExpire = (callback: () => void) =>
      setTimeout(() => {
        callback();
      }, expiresIn);

    waitSessionExpire(async () =>
      expect(
        await refreshSession
          .execute({
            refreshToken: refreshToken.id,
          })
          .then(res => res)
          .catch(err => err),
      ).toEqual(new AppError(Error.InvalidSession)),
    );
  });
});
