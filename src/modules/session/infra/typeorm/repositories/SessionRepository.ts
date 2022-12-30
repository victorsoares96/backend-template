import { EntityRepository, getRepository, Repository } from 'typeorm';

import dayjs from 'dayjs';
import { SessionRepositoryMethods } from '@modules/session/repositories/SessionRepositoryMethods';
import { CreateSessionDTO } from '@modules/session/dtos/CreateSessionDTO';
import { SessionDTO } from '@modules/session/dtos/SessionDTO';
import { FindOneSessionDTO } from '@modules/session/dtos/FindOneRefreshTokenDTO';
import { Session } from '../entities/Session';

@EntityRepository(Session)
export class SessionRepository implements SessionRepositoryMethods {
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
