export interface TokenProviderMethods {
  generate(userName: string, userId: string): string;
  verify<T>(token: string): T;
}
