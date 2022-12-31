import { AccessProfile } from '@/modules/access-profiles/infra/typeorm/entities/access-profile.entity';

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  accessProfile: AccessProfile;
  avatar: string;
  username: string;
  email: string;
  password: string;
  createdById: string;
  createdByName: string;
  updatedById: string;
  updatedByName: string;
  lastAccess: string;
}
