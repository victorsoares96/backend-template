import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

export const sessionsRouter = Router();
const sessionsController = new SessionController();

sessionsRouter.post('/sessions', sessionsController.authenticate);
sessionsRouter.post('/refresh-session', sessionsController.refresh);
