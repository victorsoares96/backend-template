import { injectable, inject } from 'tsyringe';
import { AppError } from '@/shared/errors/app-error.error';
import { AccessProfilesRepositoryInterface } from '../repositories/access-profiles-repository.interface';
import { EAccessProfileError } from '../utils/enums/errors.enum';

export interface Request {
  ids: string;
}

@injectable()
export class RemoveAccessProfileService {
  constructor(
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute({ ids }: Request): Promise<void> {
    if (!ids) throw new AppError(EAccessProfileError.IdIsRequired);

    const accessProfilesIds = ids.split(',');

    const accessProfiles = await this.accessProfilesRepository.findByIds(
      accessProfilesIds,
    );

    if (!accessProfiles) throw new AppError(EAccessProfileError.NotFound);

    await this.accessProfilesRepository.remove(accessProfiles);
  }
}
