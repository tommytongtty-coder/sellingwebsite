import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/listings', adminController.getAllListings);
router.get('/listings/:id', adminController.getListingById);
router.put('/listings/:id', adminController.updateListing);
router.post('/listings/:id/approve', adminController.approveListing);
router.post('/listings/:id/reject', adminController.rejectListing);
router.get('/logs', adminController.getLogs);
router.get('/conversations', adminController.getConversations);

export default router;
