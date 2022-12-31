import { injectable, inject } from 'tsyringe';
import { AccessProfile } from '@/modules/access-profiles/infra/typeorm/entities/access-profile.entity';
import { FindManyAccessProfileDTO } from '@/modules/access-profiles/dtos/find-many-access-profile.dto';
import { AccessProfilesRepositoryInterface } from '../repositories/access-profiles-repository.interface';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
 */

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
export class FindManyAccessProfileService {
  constructor(
    @inject('AccessProfilesRepository')
    private accessProfilesRepository: AccessProfilesRepositoryInterface,
  ) {}

  public async execute(
    filters: FindManyAccessProfileDTO,
  ): Promise<[AccessProfile[], number]> {
    const accessProfiles = await this.accessProfilesRepository.findMany(
      filters,
    );

    return accessProfiles;
  }
}
