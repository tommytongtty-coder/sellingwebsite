import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, usersController.getMe);
router.get('/me/listings', requireAuth, usersController.getMyListings);
router.get('/me/favorites', requireAuth, usersController.getMyFavorites);
router.get('/me/offers', requireAuth, usersController.getMyOffers);
router.get('/:id', usersController.getById);

export default router;
