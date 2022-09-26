import { User } from '@modules/users/infra/typeorm/entities/User';

export interface RefreshTokenDTO {
  id: string;
  userId: User['id'];
  expiresIn: number;
}
