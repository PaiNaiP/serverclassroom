import { Router } from 'express';
import userController  from '../controller/user-controller';
import cookieParser from 'cookie-parser'
import {body, validationResult} from 'express-validator'

export const userRouter = Router();
userRouter.use(cookieParser())
userRouter.post('/editProfile', userController.editUserInfo)
userRouter.post('/resetPassword', userController.resetPassword)
userRouter.get('/activatePassword/:link', userController.activate_password)
userRouter.post('/editPhoto', userController.editAvatar)
userRouter.post('/changePassword',
    body('password').isLength({min:6, max:32}),
userController.changePassword)
userRouter.post('/getUserInfo', userController.getUserInfo)

