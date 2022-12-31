import { EntityRepository, getRepository, Repository } from 'typeorm';

import dayjs from 'dayjs';
import { SessionRepositoryInterface } from '@/modules/session/repositories/session-repository.interface';
import { CreateSessionDTO } from '@/modules/session/dtos/create-session.dto';
import { SessionDTO } from '@/modules/session/dtos/session.dto';
import { FindOneSessionDTO } from '@/modules/session/dtos/find-one-session.dto';
import { Session } from '../entities/session.entity';

@EntityRepository(Session)
export class SessionRepository implements SessionRepositoryInterface {
  private ormRepository: Repository<Session>;

  constructor() {
    this.ormRepository = getRepository(Session);
  }

  public async create({ user }: CreateSessionDTO): Promise<SessionDTO> {
    const expiresIn = dayjs().add(30, 'day').unix();

    const session = this.ormRepository.create({
      user,
      expiresIn,
    });

    await this.ormRepository.save(session);

    return {
      id: session.id,
      userId: session.user.id,
      expiresIn: session.expiresIn,
    };
  }

  public async findOne({ id }: FindOneSessionDTO): Promise<Session | null> {
    const session = await this.ormRepository.findOne({
      where: [{ id }],
      loadEagerRelations: true,
    });

    if (!session) return null;
    return session;
  }

  public async remove(data: Session): Promise<Session> {
    const [session] = await this.ormRepository.remove([data]);
    return session;
  }

  public async removeAllByUserId(userId: string): Promise<void> {
    await this.ormRepository.delete({ user: { id: userId } });
  }
}
