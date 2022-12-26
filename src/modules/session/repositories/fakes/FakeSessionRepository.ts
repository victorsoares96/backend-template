import { CreateSessionDTO } from '@modules/session/dtos/CreateSessionDTO';
import { FindOneSessionDTO } from '@modules/session/dtos/FindOneRefreshTokenDTO';
import { SessionDTO } from '@modules/session/dtos/SessionDTO';
import { Session } from '@modules/session/infra/typeorm/entities/Session';
import dayjs from 'dayjs';
import { SessionRepositoryMethods } from '../SessionRepositoryMethods';

export class FakeSessionRepository implements SessionRepositoryMethods {
  private sessions: Session[] = [];

  public async create({ user }: CreateSessionDTO): Promise<SessionDTO> {
    const expiresIn = dayjs().add(15, 'second').unix();
    const session = new Session();

    Object.assign(session, {
      id: '1',
      user,
      expiresIn,
    });

    this.sessions.push(session);

    return {
      id: session.id,
      userId: session.user.id,
      expiresIn: session.expiresIn,
    };
  }

  public findOne({ id }: FindOneSessionDTO): Promise<Session | null> {
    return new Promise(resolve => {
      const refreshToken = this.sessions.find(item => item.id === id);

      resolve(refreshToken || null);
    });
  }

  public async remove(data: Session): Promise<Session> {
    const session = this.sessions.find(item => item.id === data.id);

    this.sessions.splice(this.sessions.indexOf(session!), 1);

    return session!;
  }

  public async removeAllByUserId(userId: string): Promise<void> {
    const sessions = this.sessions.filter(item => item.user.id === userId);

    sessions.forEach(session => {
      this.sessions.splice(this.sessions.indexOf(session), 1);
    });
  }
}
