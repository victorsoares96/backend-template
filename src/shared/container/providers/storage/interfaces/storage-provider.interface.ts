export interface StorageProviderInterface {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
