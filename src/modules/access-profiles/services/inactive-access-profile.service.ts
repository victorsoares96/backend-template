/* eslint-disable no-param-reassign */
import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/errors/app-error.error';
import { EAccessProfileStatus } from '@/modules/access-profiles/utils/enums/status.enum';
import { AccessProfilesRepositoryInterface } from '../repositories/access-profiles-repository.interface';
import { EAccessProfileError } from '../utils/enums/errors.enum';

interface Request {
  ids: string;
  updatedById: string;
  updatedByName: string;
}

@injectable()
export class InactiveAccessProfileService {
  constructor(
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute({
    ids,
    updatedById,
    updatedByName,
  }: Request): Promise<void> {
    const accessProfilesIds = ids.split(',');

    const accessProfiles = await this.accessProfilesRepository.findByIds(
      accessProfilesIds,
    );

    if (!accessProfiles) throw new AppError(EAccessProfileError.NotFound);
    if (
      accessProfiles.some(
        accessProfile => accessProfile.status === EAccessProfileStatus.Inactive,
      )
    )
      throw new AppError(EAccessProfileError.AlreadyInactive);

    accessProfiles.forEach(accessProfile => {
      accessProfile.status = EAccessProfileStatus.Inactive;
      accessProfile.updatedById = updatedById;
      accessProfile.updatedByName = updatedByName;
    });

    await this.accessProfilesRepository.update(accessProfiles);
  }
}
