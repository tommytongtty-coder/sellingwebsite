import { Router } from 'express';
import categoriesRoutes from './categories.routes';
import listingsRoutes from './listings.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    app: 'marketplace-template',
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

router.use('/categories', categoriesRoutes);
router.use('/listings', listingsRoutes);

export default router;
