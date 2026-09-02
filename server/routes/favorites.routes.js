import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as favoritesController from '../controllers/favorites.controller';

const router = Router();

router.get('/', requireAuth, favoritesController.getFavorites);
router.post('/', requireAuth, favoritesController.addFavorite);
router.delete('/:listingId', requireAuth, favoritesController.removeFavorite);

export default router;
