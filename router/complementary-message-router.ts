import { Router } from 'express';
import complementaryMessageController from '../controller/complementary-message-controller';

export const complementaryMessageRouter = Router();
complementaryMessageRouter.post('/addMessage', complementaryMessageController.addMessage)
complementaryMessageRouter.post('/getAllMessage', complementaryMessageController.getAll)
complementaryMessageRouter.post('/allUsers', complementaryMessageController.allUser)
complementaryMessageRouter.post('/getUserMessage', complementaryMessageController.getAllUserMessage)





