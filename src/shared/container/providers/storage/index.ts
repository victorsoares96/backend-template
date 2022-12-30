import { container } from 'tsyringe';
import uploadConfig from '@config/upload.config';

import { DiskStorageProvider } from './implementations/disk-storage.provider';
import { S3StorageProvider } from './implementations/s3-storage.provider';
import { StorageProviderInterface } from './interfaces/storage-provider.interface';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<StorageProviderInterface>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
