import { Router } from 'express';
import taskController from '../controller/task-controller';

export const taskRouter = Router();
taskRouter.post('/create', taskController.createFiles)
taskRouter.post('/view', taskController.viewTasks)
taskRouter.post('/update', taskController.update)
taskRouter.post('/delete', taskController.delete)
taskRouter.post('/addTheme', taskController.addTheme)
taskRouter.post('/deleteTheme', taskController.deleteTheme)
taskRouter.post('/allTaskWithoutTheme', taskController.allTaskWithoutTheme)
taskRouter.post('/allTaskWithTheme', taskController.allTaskWithTheme)
taskRouter.post('/viewTaskOne', taskController.viewTaskOne)
taskRouter.post('/getDecor', taskController.getDecor)

