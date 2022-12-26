import { TokenProviderMethods } from '../models/TokenProviderMethods';

export class FakeTokenProvider implements TokenProviderMethods {
  public generate(_payload: string | object | Buffer): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gMTIzIiwiaWF0IjoxNjY0MTMxNTE0LCJleHAiOjE2NjQyMTc5MTQsInN1YiI6IjEifQ.CXLk-uRlcMZoB3O2vdzP5V-Jaqk2iGiKopOWI9Bqfvc';
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
