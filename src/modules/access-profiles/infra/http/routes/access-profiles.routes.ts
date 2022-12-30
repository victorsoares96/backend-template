import { Router } from 'express';

import { AccessProfilesController } from '@modules/access-profiles/infra/http/controllers/access-profiles.controller';
import { is } from '@shared/infra/http/middlewares/ensure-authorized.middleware';
import ensureAuthenticated from '@modules/session/infra/http/middlewares/ensure-authenticated.middleware';
import {
  CAN_CREATE_ACCESS_PROFILE,
  CAN_INACTIVE_ACCESS_PROFILE,
  CAN_RECOVER_ACCESS_PROFILE,
  CAN_REMOVE_ACCESS_PROFILE,
  CAN_SOFT_REMOVE_ACCESS_PROFILE,
  CAN_UPDATE_ACCESS_PROFILE,
  CAN_VIEW_ACCESS_PROFILES,
} from '@modules/access-profiles/utils/enums/access-permissions.enum';

export const accessProfilesRouter = Router();
const accessProfilesController = new AccessProfilesController();

accessProfilesRouter.use(ensureAuthenticated);

accessProfilesRouter.get(
  '/accessProfiles',
  is([CAN_VIEW_ACCESS_PROFILES]),
  accessProfilesController.index,
);

accessProfilesRouter.post(
  '/accessProfiles',
  is([CAN_CREATE_ACCESS_PROFILE]),
  accessProfilesController.create,
);

accessProfilesRouter.put(
  '/accessProfiles',
  is([CAN_UPDATE_ACCESS_PROFILE]),
  accessProfilesController.update,
);

accessProfilesRouter.delete(
  '/accessProfiles/softRemove',
  is([CAN_SOFT_REMOVE_ACCESS_PROFILE]),
  accessProfilesController.softRemove,
);

accessProfilesRouter.delete(
  '/accessProfiles/remove',
  is([CAN_REMOVE_ACCESS_PROFILE]),
  accessProfilesController.remove,
);

accessProfilesRouter.patch(
  '/accessProfiles/recover',
  is([CAN_RECOVER_ACCESS_PROFILE]),
  accessProfilesController.recover,
);

accessProfilesRouter.patch(
  '/accessProfiles/inactive',
  is([CAN_INACTIVE_ACCESS_PROFILE]),
  accessProfilesController.inactive,
);
