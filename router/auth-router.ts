import { Router } from 'express';
import AuthController  from '../controller/auth-controller';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth-middleware';

export const authRouter = Router();
authRouter.use(cookieParser())
authRouter.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
))
authRouter.post('/registration',body('password').isLength({min:6, max:32}), 
AuthController.registration)
authRouter.get('/activate/:link', AuthController.activate)
authRouter.post('/login', AuthController.login)
authRouter.post('/logout', authMiddleware, AuthController.logout)
authRouter.get('/refresh', AuthController.refresh)
