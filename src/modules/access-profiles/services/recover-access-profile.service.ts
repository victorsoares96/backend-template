/* eslint-disable no-param-reassign */
import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/errors/app-error.error';
import { EAccessProfileStatus } from '@/modules/access-profiles/utils/enums/status.enum';
import { AccessProfilesRepositoryInterface } from '../repositories/access-profiles-repository.interface';
import { EAccessProfileError } from '../utils/enums/errors.enum';

export interface Request {
  ids: string;
  updatedById: string;
  updatedByName: string;
}

@injectable()
export class RecoverAccessProfileService {
  constructor(
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute({
    ids,
    updatedById,
    updatedByName,
  }: Request): Promise<void> {
    if (!ids) throw new AppError(EAccessProfileError.IdIsRequired);

    const accessProfilesIds = ids.split(',');

    const accessProfiles = await this.accessProfilesRepository.findByIds(
      accessProfilesIds,
      { withDeleted: true },
    );

    if (!accessProfiles) throw new AppError(EAccessProfileError.NotFound);

    accessProfiles.forEach(accessProfile => {
      accessProfile.status = EAccessProfileStatus.Active;
      accessProfile.updatedById = updatedById;
      accessProfile.updatedByName = updatedByName;
    });

    await this.accessProfilesRepository.update(accessProfiles);

    await this.accessProfilesRepository.recover(accessProfiles);
  }
}
