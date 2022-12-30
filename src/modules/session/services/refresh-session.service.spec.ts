import { FakeAccessProfileRepository } from '@modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/fake-user.repository';
import { CreateUserService } from '@modules/users/services/create-user.service';
import { EUserStatus } from '@modules/users/utils/enums/user.enum';
import { Error } from '@modules/session/utils/enums/errors.enum';
import { AppError } from '@shared/errors/app-error.error';
import dayjs from 'dayjs';
import { FakeHashProvider } from '../providers/hash';
import { FakeTokenProvider } from '../providers/token';
import { FakeSessionRepository } from '../repositories/fakes/fake-session.repository';
import { CreateSessionService } from './create-session.service';
import { RefreshSessionService } from './refresh-session.service';

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
