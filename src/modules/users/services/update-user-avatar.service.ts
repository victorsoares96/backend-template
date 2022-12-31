import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/errors/app-error.error';
import { User } from '@/modules/users/infra/typeorm/entities/user.entity';
import { EUserError } from '@/modules/users/utils/enums/errors.enum';
import { StorageProviderInterface } from '@/shared/container/providers/storage/interfaces/storage-provider.interface';
import { UsersRepositoryInterface } from '../repositories/user-repository.interface';

interface Request {
  userId: string;
  avatarFilename: string;
}

@injectable()
export class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
    @inject('StorageProvider')
    private storageProvider: StorageProviderInterface,
  ) {}

  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) throw new AppError(EUserError.NotFound);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.update([user]);

    return user;
  }
}
