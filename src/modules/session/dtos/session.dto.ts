import { User } from '@modules/users/infra/typeorm/entities/user.entity';

export interface SessionDTO {
  id: string;
  userId: User['id'];
  expiresIn: number;
}
