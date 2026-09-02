import { Router } from 'express';
import authRoutes from './auth.routes';
import categoriesRoutes from './categories.routes';
import listingsRoutes from './listings.routes';
import usersRoutes from './users.routes';
import favoritesRoutes from './favorites.routes';
import offersRoutes from './offers.routes';
import conversationsRoutes from './conversations.routes';
import reportsRoutes from './reports.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    app: 'marketplace-template',
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/listings', listingsRoutes);
router.use('/users', usersRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/offers', offersRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/reports', reportsRoutes);
router.use('/admin', adminRoutes);

export default router;
