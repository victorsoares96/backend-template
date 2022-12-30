import { injectable, inject } from 'tsyringe';
import { AccessProfile } from '@modules/access-profiles/infra/typeorm/entities/access-profile.entity';
import { AppError } from '@shared/errors/app-error.error';
import { EGenericError } from '@shared/utils/enums/errors.enum';
import { AccessProfilesRepositoryInterface } from '../repositories/access-profiles-repository.interface';
import { FindOneAccessProfileDTO } from '../dtos/find-one-access-profile.dto';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
 */

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
export class FindOneAccessProfileService {
  constructor(
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute(
    filters: FindOneAccessProfileDTO,
  ): Promise<AccessProfile | null> {
    if (
      Object.keys(filters).length === 0 ||
      Object.values(filters).some(value => !value)
    )
      throw new AppError(EGenericError.MissingFilters);
    const accessProfiles = await this.accessProfilesRepository.findOne(filters);

    return accessProfiles;
  }
}
