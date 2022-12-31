import { Permission } from '@/modules/permissions/infra/typeorm/entities/permission.entity';

export interface CreateAccessProfileDTO {
  name: string;
  description?: string;
  status?: number;
  createdById?: string;
  createdByName?: string;
  updatedById?: string;
  updatedByName?: string;
  permissions: Permission[];
}
