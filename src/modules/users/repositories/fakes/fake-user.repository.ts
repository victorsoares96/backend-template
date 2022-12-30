import { FindManyAccessProfileDTO } from '@modules/access-profiles/dtos/find-many-access-profile.dto';
import { CreateUserDTO } from '@modules/users/dtos/create-user.dto';
import { User } from '@modules/users/infra/typeorm/entities/user.entity';
import { EUserStatus } from '@modules/users/utils/enums/user.enum';
import { FindOneUserDTO } from '@modules/users/dtos/find-one-user.dto';
import { UserDTO } from '@modules/users/dtos/user.dto';
import { UsersRepositoryInterface } from '../user-repository.interface';

export class FakeUsersRepository implements UsersRepositoryInterface {
  private users: User[] = [];

  public async create(userData: CreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: '1',
      status: EUserStatus.Active,
      ...userData,
    });

    this.users.push(user);

    return user;
  }

  public findOne(filters: FindOneUserDTO): Promise<User | null> {
    return new Promise(resolve => {
      const user = this.users.find(item => {
        for (const filter in filters) {
          if (
            // @ts-ignore
            item[filter] === undefined ||
            // @ts-ignore
            !item[filter].includes(filters[filter])
          )
            return false;
        }
        return true;
      });

      resolve(user || null);
    });
  }

  public findMany(
    filters: FindManyAccessProfileDTO,
  ): Promise<[User[], number]> {
    return new Promise(resolve => {
      const users = this.users.filter(item => {
        for (const filter in filters) {
          if (
            // @ts-ignore
            item[filter] === undefined ||
            // @ts-ignore
            !item[filter].includes(filters[filter])
          )
            return false;
        }
        return true;
      });

      resolve([users, users.length]);
    });
  }

  public async findByIds(ids: string[]): Promise<User[] | null> {
    const findUsers = ids.map(id => this.users.find(user => user.id === id));
    if (findUsers.some(el => !el)) return null;
    return findUsers as User[];
  }

  public async update(data: UserDTO[]): Promise<User[]> {
    const users = data;

    users.forEach(user => {
      const index = this.users.findIndex(item => item.id === user.id);

      this.users[index] = user;
    });

    return this.users;
  }

  public async recover(data: UserDTO[]): Promise<User[]> {
    const users = data;

    users.forEach(user => {
      const index = this.users.findIndex(item => item.id === user.id);

      this.users[index] = {
        ...this.users[index],
        status: EUserStatus.Active,
      };
    });

    return this.users;
  }

  public async remove(data: User[]): Promise<User[]> {
    const usersId = data.map(user => user.id);
    const users = this.users.filter(user => !usersId.includes(user.id));

    this.users = users;
    return data;
  }

  public async softRemove(data: UserDTO[]): Promise<User[]> {
    const usersId = data.map(user => user.id);
    const findUsers = this.users.filter(user => usersId.includes(user.id));
    const softRemoveUsers = findUsers.map(user => {
      return { ...user, status: EUserStatus.Deleted };
    });

    this.users = softRemoveUsers;
    return softRemoveUsers;
  }
}
