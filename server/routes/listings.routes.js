import { Router } from 'express';
import * as listingsController from '../controllers/listings.controller';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', listingsController.getAll);
router.get('/:id', listingsController.getById);
router.post('/', requireAuth, listingsController.create);
router.put('/:id', requireAuth, listingsController.update);
router.post('/:id/images', requireAuth, upload.array('photos', 10), listingsController.uploadImages);
router.post('/:id/publish', requireAuth, listingsController.publish);

export default router;
