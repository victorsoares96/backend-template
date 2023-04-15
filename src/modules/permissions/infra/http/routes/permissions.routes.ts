import { Router } from 'express';

import { is } from '@/shared/infra/http/middlewares/ensure-authorized.middleware';
import { PermissionsController } from '@/modules/permissions/infra/http/controllers/permissions.controller';
import ensureAuthenticated from '@/modules/session/infra/http/middlewares/ensure-authenticated.middleware';
import {
  CAN_CREATE_PERMISSION,
  CAN_VIEW_PERMISSIONS,
} from '@/modules/permissions/utils/enums/access-permissions.enum';

export const permissionsRouter = Router();
const permissionsController = new PermissionsController();

permissionsRouter.use(ensureAuthenticated);

permissionsRouter.get(
  '/permissions',
  is([CAN_VIEW_PERMISSIONS]),
  permissionsController.index,
);

permissionsRouter.post(
  '/permissions',
  is([CAN_CREATE_PERMISSION]),
  permissionsController.create,
);
