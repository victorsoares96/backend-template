import { hash, compare } from 'bcryptjs';
import { HashProviderInterface } from '../interfaces/hash-provider.interface';

export class HashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
