import { AppError } from '@/shared/errors/app-error.error';
import { EGenericError } from '@/shared/utils/enums/errors.enum';
import { injectable, inject } from 'tsyringe';
import { FindOnePermissionDTO } from '../dtos/find-one-permission.dto';

import { Permission } from '../infra/typeorm/entities/permission.entity';
import { PermissionsRepositoryInterface } from '../repositories/permissions-repository.interface';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
 */

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
export class FindOnePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  public async execute(
    filters: FindOnePermissionDTO,
  ): Promise<Permission | null> {
    if (
      Object.keys(filters).length === 0 ||
      Object.values(filters).some(value => !value)
    )
      throw new AppError(EGenericError.MissingFilters);
    const permission = await this.permissionsRepository.findOne(filters);

    return permission;
  }
}
