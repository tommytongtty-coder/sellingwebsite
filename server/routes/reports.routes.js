import { Router } from 'express';
import * as reportsController from '../controllers/reports.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, reportsController.create);
router.get('/', requireAuth, requireAdmin, reportsController.getAll);
router.patch('/:id/status', requireAuth, requireAdmin, reportsController.updateStatus);

export default router;
