import { FakeAccessProfileRepository } from '@/modules/access-profiles/repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from '@/modules/access-profiles/services/create-access-profile.service';
import { FakePermissionsRepository } from '@/modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@/modules/permissions/services/create-permission.service';
import { FakeTokenProvider } from '@/modules/session/providers/token';
import { FakeSessionRepository } from '@/modules/session/repositories/fakes/fake-session.repository';
import { CreateSessionService } from '@/modules/session/services/create-session.service';
import { AppError } from '@/shared/errors/app-error.error';
import { FakeHashProvider } from '../../session/providers/hash/fakes/fake-hash.provider';
import { FakeUsersRepository } from '../repositories/fakes/fake-user.repository';
import { EUserError } from '../utils/enums/errors.enum';
import { EUserStatus } from '../utils/enums/user.enum';
import { CreateUserService } from './create-user.service';
import { ResetUserPasswordService } from './reset-user-password.service';

let fakeSessionRepository: FakeSessionRepository;
let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;
let createSession: CreateSessionService;
let resetPassword: ResetUserPasswordService;

describe('ResetUserPassword', () => {
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
    resetPassword = new ResetUserPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
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

    await resetPassword.execute({
      id: user.id,
      currentPassword: 'Password123',
      newPassword: 'NewPassword123',
    });

    const response = await createSession.execute({
      username: 'foobar',
      password: 'NewPassword123',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to reset password if not provide a user id', async () => {
    expect(
      await resetPassword
        .execute({
          id: '',
          currentPassword: 'Password123',
          newPassword: 'NewPassword123',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.IsRequired));
  });

  it('should not be able to reset password if not provide a current password or new password', async () => {
    expect(
      await resetPassword
        .execute({
          id: '1',
          currentPassword: '',
          newPassword: '',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.CurrentOrNewPasswordRequired));
  });

  it('should not be able to reset password if not found user', async () => {
    expect(
      await resetPassword
        .execute({
          id: '2',
          currentPassword: 'Password123',
          newPassword: 'NewPassword123',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EUserError.NotFound));
  });
});
