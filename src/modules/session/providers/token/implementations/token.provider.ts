import { sign, verify } from 'jsonwebtoken';
import { TokenProviderInterface } from '../interfaces/token-provider.interface';

const secret = '6c1839afa3ad1f8a4ae68c74c28933ea';
const expiresIn = '1h';

export class TokenProvider implements TokenProviderInterface {
  public generate(userName: string, userId: string): string {
    const token = sign({ name: userName }, secret, {
      subject: String(userId),
      expiresIn,
    });
    return token;
  }

  public verify<T>(token: string): T {
    const decoded = verify(token, secret);
    return decoded as T;
  }
}
