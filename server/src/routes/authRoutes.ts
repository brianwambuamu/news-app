import { Router } from 'express';
import { login, logout, getMe, changePassword } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.put('/change-password', requireAuth, changePassword);

export default router;
