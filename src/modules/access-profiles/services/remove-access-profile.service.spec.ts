import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { EAccessProfileError } from '../utils/enums/errors.enum';
import { CreateAccessProfileService } from './create-access-profile.service';
import { RemoveAccessProfileService } from './remove-access-profile.service';
import { FindOneAccessProfileService } from './find-one-access-profile.service';

let removeAccessProfile: RemoveAccessProfileService;
let findOneAccessProfile: FindOneAccessProfileService;

describe('RemoveAccessProfile', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );

    const fakeAccessProfilesRepository = new FakeAccessProfileRepository();
    const createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
    removeAccessProfile = new RemoveAccessProfileService(
      fakeAccessProfilesRepository,
    );
    findOneAccessProfile = new FindOneAccessProfileService(
      fakeAccessProfilesRepository,
    );

    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });
  });

  it('should not be able to remove the access profile if the id is not provided', async () => {
    expect(
      await removeAccessProfile
        .execute({ ids: '' })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.IdIsRequired));
  });

  it('should not be able to remove the access profile if it is not found', async () => {
    expect(
      await removeAccessProfile
        .execute({ ids: '2' })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });

  it('should be able to remove a access profile', async () => {
    await removeAccessProfile.execute({ ids: '1' });

    expect(await findOneAccessProfile.execute({ name: 'Admin' })).toEqual(null);
  });
});
