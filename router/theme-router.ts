import { Router } from 'express';
import themeController from '../controller/theme-controller';

export const themeRouter = Router();
themeRouter.post('/create', themeController.create)
themeRouter.post('/viewAll', themeController.viewAll)
themeRouter.post('/update', themeController.update)
themeRouter.post('/delete', themeController.delete)



