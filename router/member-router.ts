import { Router } from 'express';
import memberController from '../controller/member-controller';

export const memberRouter = Router();
memberRouter.post('/viewAll', memberController.getAllUsers)
memberRouter.post('/checkRole', memberController.checkRoleUser)
memberRouter.post('/sendMail', memberController.sendActiveMail)
memberRouter.get('/:link/:role/:id', memberController.add)
memberRouter.post('/viewTeacher', memberController.viewTeacher)
memberRouter.post('/viewStudent', memberController.viewStudent)
memberRouter.post('/viewFreeUsers', memberController.freeUsers)
memberRouter.post('/addUsersToClass', memberController.addToClass)
memberRouter.post('/deleteFromClass', memberController.deleteFromClass)
memberRouter.post('/addGroupToClass', memberController.addGroupToClass)
