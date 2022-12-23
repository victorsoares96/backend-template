import { EntityRepository, getRepository, Repository } from 'typeorm';

import { RefreshTokenRepositoryMethods } from '@modules/session/repositories/RefreshTokenRepositoryMethods';
import dayjs from 'dayjs';
import { CreateRefreshTokenDTO } from '@modules/session/dtos/CreateRefreshTokenDTO';
import { RefreshTokenDTO } from '@modules/session/dtos/RefreshTokenDTO';
import { FindOneRefreshTokenDTO } from '@modules/session/dtos/FindOneRefreshTokenDTO';
import { RefreshToken } from '../entities/RefreshToken';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository implements RefreshTokenRepositoryMethods {
  private ormRepository: Repository<RefreshToken>;

  constructor() {
    this.ormRepository = getRepository(RefreshToken);
  }

  public async create({
    user,
  }: CreateRefreshTokenDTO): Promise<RefreshTokenDTO> {
    const expiresIn = dayjs().add(15, 'second').unix();

    const refreshToken = this.ormRepository.create({
      user,
      expiresIn,
    });

    await this.ormRepository.save(refreshToken);

    return {
      id: refreshToken.id,
      userId: refreshToken.user.id,
      expiresIn: refreshToken.expiresIn,
    };
  }

  public async findOne({
    id,
  }: FindOneRefreshTokenDTO): Promise<RefreshToken | null> {
    const refreshToken = await this.ormRepository.findOne({
      where: [{ id }],
      loadEagerRelations: true,
    });

    return refreshToken;
  }

  public async remove(data: RefreshToken): Promise<RefreshToken> {
    const [refreshToken] = await this.ormRepository.remove([data]);
    return refreshToken;
  }

  public async removeAllByUserId(userId: string): Promise<void> {
    await this.ormRepository.delete({ user: { id: userId } });
  }
}
