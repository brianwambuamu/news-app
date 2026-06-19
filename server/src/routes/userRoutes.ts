import { Router } from 'express';
import {
  createUser,
  listUsers,
  terminateUser,
  deleteUser,
} from '../controllers/userController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All user-management routes are admin-only.
router.use(requireAuth, requireRole('admin'));

router.post('/', createUser);
router.get('/', listUsers);
router.patch('/:id/terminate', terminateUser);
router.delete('/:id', deleteUser);

export default router;
