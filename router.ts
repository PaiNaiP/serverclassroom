import { Router } from 'express';
import { authRouter } from './router/auth-router';
import { userRouter } from './router/user-router';
import { classRouter } from './router/class-router';
import { memberRouter } from './router/member-router';
import { taskRouter } from './router/task-router';
import cors from 'cors'
import { groupRouter } from './router/group-router';
import { themeRouter } from './router/theme-router';
import { complementaryRouter } from './router/complementary-router';
import { complementaryMessageRouter } from './router/complementary-message-router';
import { taskMessageRouter } from './router/task-message-router';
export const router = Router();
router.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
))
router.use('/auth/', authRouter)
router.use('/user/', userRouter)
router.use('/class/', classRouter)
router.use('/member/', memberRouter)
router.use('/task/', taskRouter)
router.use('/group/', groupRouter)
router.use('/theme/', themeRouter)
router.use('/complementary/', complementaryRouter)
router.use('/complemetaryMessage/', complementaryMessageRouter)
router.use('/taskMessage/', taskMessageRouter)