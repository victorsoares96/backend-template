import { HashProviderInterface } from '../interfaces/hash-provider.interface';

export class FakeHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
