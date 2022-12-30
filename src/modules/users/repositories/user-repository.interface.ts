import { CreateUserDTO } from '../dtos/create-user.dto';
import { FindManyUserDTO } from '../dtos/find-many-user.dto';
import { FindOneUserDTO } from '../dtos/find-one-user.dto';
import { UserDTO } from '../dtos/user.dto';
import { User } from '../infra/typeorm/entities/user.entity';

export interface FindOptions {
  withDeleted?: boolean;
}
export interface UsersRepositoryInterface {
  create(data: CreateUserDTO): Promise<User>;
  findOne(data: FindOneUserDTO): Promise<User | null>;
  findMany(data: FindManyUserDTO): Promise<[User[], number]>;
  findByIds(ids: string[], options?: FindOptions): Promise<User[] | null>;
  update(data: UserDTO[]): Promise<User[]>;
  recover(data: UserDTO[]): Promise<User[]>;
  remove(data: UserDTO[]): Promise<User[]>;
  softRemove(data: UserDTO[]): Promise<User[]>;
}
