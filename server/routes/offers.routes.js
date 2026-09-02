import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as offersController from '../controllers/offers.controller';

const router = Router();

router.get('/listing/:listingId', requireAuth, offersController.getOffersForListing);
router.post('/', requireAuth, offersController.createOffer);
router.patch('/:id/status', requireAuth, offersController.updateOfferStatus);

export default router;
