import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as offersController from '../controllers/offers.controller';

const router = Router();

router.get('/listing/:listingId', requireAuth, offersController.getOffersForListing);
router.get('/listing/:listingId/latest', requireAuth, offersController.getLatestOffer);
router.post('/', requireAuth, offersController.createOffer);
router.patch('/:id/status', requireAuth, offersController.updateOfferStatus);
router.patch('/:id/accept', requireAuth, offersController.acceptOffer);
router.patch('/:id/reject', requireAuth, offersController.rejectOffer);
router.post('/:id/counter', requireAuth, offersController.counterOffer);

export default router;
