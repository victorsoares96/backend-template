import { AppError } from '@/shared/errors/app-error.error';
import { injectable, inject } from 'tsyringe';
import { CreatePermissionDTO } from '../dtos/create-permission.dto';

import { Permission } from '../infra/typeorm/entities/permission.entity';
import { PermissionsRepositoryInterface } from '../repositories/permissions-repository.interface';
import { EPermissionError } from '../utils/enums/errors.enum';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
 */

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
export class CreatePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  public async execute({ name }: CreatePermissionDTO): Promise<Permission> {
    if (!name) throw new AppError(EPermissionError.NameRequired);
    if (name.length < 3) throw new AppError(EPermissionError.NameTooShort);
    if (name.length > 35) throw new AppError(EPermissionError.NameTooLong);

    const permissionExists = await this.permissionsRepository.findOne({
      name,
    });
    if (permissionExists) throw new AppError(EPermissionError.AlreadyExist);

    const permission = this.permissionsRepository.create({
      name,
    });

    return permission;
  }
}
