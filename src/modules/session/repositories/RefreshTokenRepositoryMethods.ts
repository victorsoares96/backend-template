import { CreateRefreshTokenDTO } from '../dtos/CreateRefreshTokenDTO';
import { FindOneRefreshTokenDTO } from '../dtos/FindOneRefreshTokenDTO';
import { RefreshTokenDTO } from '../dtos/RefreshTokenDTO';
import { RefreshToken } from '../infra/typeorm/entities/RefreshToken';

export interface RefreshTokenRepositoryMethods {
  create(data: CreateRefreshTokenDTO): Promise<RefreshTokenDTO>;
  findOne(data: FindOneRefreshTokenDTO): Promise<RefreshToken | null>;
  remove(data: RefreshToken): Promise<RefreshToken>;
  removeAllByUserId(userId: string): Promise<void>;
}
