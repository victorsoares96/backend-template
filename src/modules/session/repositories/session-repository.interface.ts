import { CreateSessionDTO } from '../dtos/create-session.dto';
import { FindOneSessionDTO } from '../dtos/find-one-session.dto';
import { SessionDTO } from '../dtos/session.dto';
import { Session } from '../infra/typeorm/entities/session.entity';

export interface SessionRepositoryInterface {
  create(data: CreateSessionDTO): Promise<SessionDTO>;
  findOne(data: FindOneSessionDTO): Promise<Session | null>;
  remove(data: Session): Promise<Session>;
  removeAllByUserId(userId: string): Promise<void>;
}
