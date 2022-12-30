import { injectable, inject } from 'tsyringe';
import { FindManyPermissionDTO } from '../dtos/find-many-permission.dto';

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
export class FindManyPermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  public async execute(
    filters: FindManyPermissionDTO,
  ): Promise<[Permission[], number]> {
    const permissions = await this.permissionsRepository.findMany(filters);

    return permissions;
  }
}
