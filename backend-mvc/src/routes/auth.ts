import { Router } from 'express';
import { authController } from '../controllers/authController';
export const authRouter = Router();

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);
authRouter.get('/register', authController.getRegister);
authRouter.post('/register', authController.postRegister);
authRouter.post('/logout', authController.postLogout);
