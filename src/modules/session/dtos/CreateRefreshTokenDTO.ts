import { User } from '@modules/users/infra/typeorm/entities/User';

export interface CreateRefreshTokenDTO {
  user: User;
}
