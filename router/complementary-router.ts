import { Router } from 'express';
import complementaryController from '../controller/complementary-controller';

export const complementaryRouter = Router();
complementaryRouter.post('/getOne', complementaryController.getOne)
complementaryRouter.post('/editStatus', complementaryController.editStatusWithoutFiles)
complementaryRouter.post('/addFiles', complementaryController.addFiles)
complementaryRouter.post('/deleteFile', complementaryController.deleteFile)
complementaryRouter.post('/getAll', complementaryController.getAll)
complementaryRouter.post('/addMark', complementaryController.addMark)




