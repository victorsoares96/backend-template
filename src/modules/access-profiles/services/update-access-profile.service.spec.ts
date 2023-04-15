import { FakePermissionsRepository } from '@/modules/permissions/repositories/fakes/fake-permissions.repository';
import { CreatePermissionService } from '@/modules/permissions/services/create-permission.service';
import { EPermissionError } from '@/modules/permissions/utils/enums/errors.enum';
import { AppError } from '@/shared/errors/app-error.error';
import { AccessProfile } from '../infra/typeorm/entities/access-profile.entity';
import { FakeAccessProfileRepository } from '../repositories/fakes/fake-access-profiles.repository';
import { EAccessProfileError } from '../utils/enums/errors.enum';
import { CreateAccessProfileService } from './create-access-profile.service';
import { FindOneAccessProfileService } from './find-one-access-profile.service';
import { UpdateAccessProfileService } from './update-access-profile.service';

let fakeAccessProfileRepository: FakeAccessProfileRepository;
let createAccessProfile: CreateAccessProfileService;
let updateAccessProfile: UpdateAccessProfileService;
let findOneAccessProfile: FindOneAccessProfileService;

describe('UpdateAccessProfile', () => {
  beforeEach(async () => {
    const fakePermissionsRepository = new FakePermissionsRepository();
    const createPermission = new CreatePermissionService(
      fakePermissionsRepository,
    );
    await createPermission.execute({
      name: 'CAN_CREATE_USER',
    });

    fakeAccessProfileRepository = new FakeAccessProfileRepository();
    createAccessProfile = new CreateAccessProfileService(
      fakeAccessProfileRepository,
      fakePermissionsRepository,
    );
    updateAccessProfile = new UpdateAccessProfileService(
      fakeAccessProfileRepository,
      fakePermissionsRepository,
    );
    findOneAccessProfile = new FindOneAccessProfileService(
      fakeAccessProfileRepository,
    );
  });

  it('should be able to update a access profile', async () => {
    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    await updateAccessProfile.execute({
      id: '1',
      name: 'Admin 2',
      permissionsId: '1',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    const accessProfile = (await findOneAccessProfile.execute({
      id: '1',
    })) as AccessProfile;

    expect(accessProfile.name).toBe('Admin 2');
  });

  it('should not be able to update a access profile if the id are not informed', async () => {
    expect(
      await updateAccessProfile
        .execute({
          id: '',
          name: 'Admin 2',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.IdIsRequired));
  });

  it('should not be able to update a access profile if the permission informed does not exist', async () => {
    await createAccessProfile.execute({
      name: 'Admin',
      description: 'Access profile for admins',
      permissionsId: '1',
      createdById: '1',
      createdByName: 'Foo',
      updatedById: '1',
      updatedByName: 'Foo',
    });

    expect(
      await updateAccessProfile
        .execute({
          id: '1',
          name: 'Admin 2',
          permissionsId: '2',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EPermissionError.NotFound));
  });

  it('should not be able to update a access profile if name provided is less than three characters', async () => {
    expect(
      await updateAccessProfile
        .execute({
          id: '1',
          name: 'Ad',
          permissionsId: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NameTooShort));
  });

  it('should not be able to update a access profile if name provided is more than thirty five characters', async () => {
    expect(
      await updateAccessProfile
        .execute({
          id: '1',
          name: 'NameVeryVeryLongCreatedSpecifyForThisTest',
          permissionsId: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NameTooLong));
  });

  it('should not be able to update if this access profile is not exists', async () => {
    expect(
      await updateAccessProfile
        .execute({
          id: '1',
          name: 'Admin 2',
          permissionsId: '1',
          updatedById: '1',
          updatedByName: 'Foo',
        })
        .then(res => res)
        .catch(err => err),
    ).toEqual(new AppError(EAccessProfileError.NotFound));
  });
});
