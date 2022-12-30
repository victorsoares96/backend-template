import { FakePermissionsRepository } from '@modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@modules/permissions/services/create-permission.service';
import { AppError } from '@shared/errors/app-error.error';
import { EGenericError } from '@shared/utils/enums/errors.enum';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { CreateAccessProfileService } from './create-access-profile.service';
import { FindOneAccessProfileService } from './find-one-access-profile.service';

let fakeAccessProfilesRepository: FakeAccessProfileRepository;
let createAccessProfile: CreateAccessProfileService;
let findAccessProfile: FindOneAccessProfileService;

describe('FindOneAccessProfile', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    fakeAccessProfilesRepository = new FakeAccessProfileRepository();
    createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfilesRepository,
      fakePermissionsRepository,
    );
    findAccessProfile = new FindOneAccessProfileService(
      fakeAccessProfilesRepository,
    );
  });

  it('should not allow the search if no filter is sent', async () => {
    expect(
      await findAccessProfile
        .execute({
          name: '',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EGenericError.MissingFilters));
    expect(
      await findAccessProfile
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .execute({})
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EGenericError.MissingFilters));
  });

  it('should be able to search and return only one access profile', async () => {
    const accessProfile = await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    const accessProfileFound = await findAccessProfile.execute({
      name: 'Admin',
    });

    expect(accessProfileFound).toEqual(accessProfile);
  });
});
