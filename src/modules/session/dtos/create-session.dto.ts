import { User } from '@modules/users/infra/typeorm/entities/user.entity';

export interface CreateSessionDTO {
  user: User;
}
