import { Router } from 'express';
import groupController from '../controller/group-controller';

export const groupRouter = Router();
groupRouter.post('/create', groupController.createGroup)
groupRouter.post('/edit', groupController.editGroup)
groupRouter.post('/delete', groupController.deleteGroup)
groupRouter.post('/viewUsers', groupController.viewAllUsersInGroup)
groupRouter.post('/getAll', groupController.getGroups)
groupRouter.post('/viewFreeUsers', groupController.viewFreeUsers)
groupRouter.post('/addUserToGroup', groupController.addUserToGroup)
groupRouter.post('/deleteUserFromGroup', groupController.deleteUserFromGroup)
groupRouter.get('/:link/:id', groupController.activateUserToGroup)


