import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/app-error.error';
import { EGenericError } from '@shared/utils/enums/errors.enum';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';
import { FindOneUserDTO } from '../dtos/find-one-user.dto';
import { User } from '../infra/typeorm/entities/user.entity';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
 */

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
export class FindOneUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  public async execute(filters: FindOneUserDTO): Promise<User | null> {
    if (
      Object.keys(filters).length === 0 ||
      Object.values(filters).some(value => !value)
    )
      throw new AppError(EGenericError.MissingFilters);
    const user = await this.usersRepository.findOne(filters);

    return user;
  }
}
