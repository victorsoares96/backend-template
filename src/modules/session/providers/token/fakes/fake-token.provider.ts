import { TokenProviderInterface } from '../interfaces/token-provider.interface';

export class FakeTokenProvider implements TokenProviderInterface {
  public generate(_payload: string | object | Buffer): string {
    const randomToken = Math.random().toString(36).substring(2, 15);
    return randomToken;
  }

  public verify<T = unknown>(_token: string): T {
    return {
      name: 'John Doe',
      iat: 1664131514,
      exp: 1664217914,
      sub: '1',
    } as unknown as T;
  }
}
