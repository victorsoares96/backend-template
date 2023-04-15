export interface TokenProviderInterface {
  generate(userName: string, userId: string): string;
  verify<T>(token: string): T;
}
