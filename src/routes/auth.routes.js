import express from 'express';
import {
  registerController,
  loginController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/auth.controller.js';
import { sendResetEmail } from '../controllers/auth/sendResetEmail.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';

import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';
import { resetEmailSchema } from '../schemas/resetEmailSchema.js';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmail),
);

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
