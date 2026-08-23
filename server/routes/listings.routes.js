import { Router } from 'express';
import * as listingsController from '../controllers/listings.controller';

const router = Router();

router.get('/', listingsController.getAll);

export default router;
