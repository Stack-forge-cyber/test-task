import { Router } from 'express';

import * as authController from '../controllers/auth.js';
import { auth } from '../shared/middlewares/auth.js';
import { validateBody } from '../shared/middlewares/validate.js';
import { loginSchema } from '../shared/schemes/schemes.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), authController.login);
authRouter.get('/me', auth, authController.me);
authRouter.post('/logout', auth, authController.logout);
