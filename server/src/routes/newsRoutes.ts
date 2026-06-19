import { Router } from 'express';
import {
  createNews,
  listNews,
  getNewsById,
  deleteNews,
  getCategories,
} from '../controllers/newsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { uploadNewsImage } from '../middleware/upload';

const router = Router();

router.get('/categories', getCategories);

// Reading news requires being logged in (admin or reporter), per the brief's
// two-portal scope. Open this up with a public route later if a public
// site is added.
router.get('/', requireAuth, listNews);
router.get('/:id', requireAuth, getNewsById);

router.post(
  '/',
  requireAuth,
  requireRole('admin', 'reporter'),
  uploadNewsImage.single('image'),
  createNews
);

router.delete('/:id', requireAuth, requireRole('admin', 'reporter'), deleteNews);

export default router;
