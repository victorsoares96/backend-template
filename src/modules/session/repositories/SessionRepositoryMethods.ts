import { CreateSessionDTO } from '../dtos/CreateSessionDTO';
import { FindOneSessionDTO } from '../dtos/FindOneRefreshTokenDTO';
import { SessionDTO } from '../dtos/SessionDTO';
import { Session } from '../infra/typeorm/entities/Session';

export interface SessionRepositoryMethods {
  create(data: CreateSessionDTO): Promise<SessionDTO>;
  findOne(data: FindOneSessionDTO): Promise<Session | null>;
  remove(data: Session): Promise<Session>;
  removeAllByUserId(userId: string): Promise<void>;
}
