import { AccessProfile } from '@modules/access-profiles/infra/typeorm/entities/access-profile.entity';

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: number;
  accessProfile: AccessProfile;
  avatar: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  deletionDate: Date;
  lastAccess: string;
}
