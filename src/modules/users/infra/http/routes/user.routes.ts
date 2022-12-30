import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload.config';
import {
  CAN_REMOVE_USER,
  CAN_SOFT_REMOVE_USER,
  CAN_UPDATE_USER,
  CAN_UPDATE_USER_AVATAR,
  CAN_VIEW_USER,
  CAN_RECOVER_USER,
} from '@modules/users/utils/enums/access-permissions.enum';
import ensureAuthenticated from '@modules/session/infra/http/middlewares/ensure-authenticated.middleware';

import { is } from '@shared/infra/http/middlewares/ensure-authorized.middleware';
import { UserController } from '../controllers/user.controller';

export const usersRouter = Router();
const usersController = new UserController();

const upload = multer(uploadConfig.multer);

usersRouter.get(
  '/users',
  ensureAuthenticated,
  is([CAN_VIEW_USER]),
  usersController.index,
);

usersRouter.post('/users', ensureAuthenticated, usersController.create);

usersRouter.put(
  '/users',
  ensureAuthenticated,
  is([CAN_UPDATE_USER]),
  usersController.update,
);

usersRouter.patch(
  '/users/avatar',
  ensureAuthenticated,
  is([CAN_UPDATE_USER_AVATAR]),
  upload.single('avatar'),
  usersController.updateAvatar,
);

usersRouter.delete(
  '/users/softRemove',
  ensureAuthenticated,
  is([CAN_SOFT_REMOVE_USER]),
  usersController.softRemove,
);

usersRouter.delete(
  '/users/remove',
  ensureAuthenticated,
  is([CAN_REMOVE_USER]),
  usersController.remove,
);

usersRouter.patch(
  '/users/recover',
  ensureAuthenticated,
  is([CAN_RECOVER_USER]),
  usersController.recover,
);

usersRouter.patch(
  '/users/inactive',
  ensureAuthenticated,
  is([CAN_RECOVER_USER]),
  usersController.inactive,
);

usersRouter.patch('/users/password', usersController.resetPassword);
