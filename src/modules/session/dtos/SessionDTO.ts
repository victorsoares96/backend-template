import { User } from '@modules/users/infra/typeorm/entities/User';

export interface SessionDTO {
  id: string;
  userId: User['id'];
  expiresIn: number;
}
