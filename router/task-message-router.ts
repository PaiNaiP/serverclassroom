import { Router } from 'express';
import taskMessageController from '../controller/task-message-controller';

export const taskMessageRouter = Router();
taskMessageRouter.post('/addMessage', taskMessageController.addMessage)
taskMessageRouter.post('/getAllMessage', taskMessageController.getAll)
