import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', logout);

export default router;
