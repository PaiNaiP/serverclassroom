import { Router } from 'express';
import classController  from '../controller/class-controller';

export const classRouter = Router();
classRouter.post('/create', classController.createClass)
classRouter.post('/getAll', classController.getClass)
classRouter.post('/getAllArchive', classController.getClassArchive)
classRouter.post('/getOne', classController.getClassOne)
classRouter.post('/authorInfo', classController.getAuthorInfo)
classRouter.post('/editCover', classController.editCover)
classRouter.post('/edit', classController.updateClass)
classRouter.post('/addArchive', classController.addArchive)
classRouter.post('/getClassStudent', classController.getClassStudent)
classRouter.post('/getClassTeacher', classController.getClassTeacher)
classRouter.post('/delete', classController.delete)

