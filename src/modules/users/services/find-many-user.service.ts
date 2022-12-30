import { injectable, inject } from 'tsyringe';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';
import { FindManyUserDTO } from '../dtos/find-many-user.dto';
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
export class FindManyUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  public async execute(filters: FindManyUserDTO): Promise<[User[], number]> {
    const users = await this.usersRepository.findMany(filters);

    return users;
  }
}
