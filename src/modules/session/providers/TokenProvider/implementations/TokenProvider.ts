import { sign, verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { TokenProviderMethods } from '../models/TokenProviderMethods';

export class TokenProvider implements TokenProviderMethods {
  public generate(userName: string, userId: string): string {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ name: userName }, secret, {
      subject: String(userId),
      expiresIn,
    });
    return token;
  }

  public verify<T>(token: string): T {
    const { secret } = authConfig.jwt;

    const decoded = verify(token, secret);
    return decoded as T;
  }
}
