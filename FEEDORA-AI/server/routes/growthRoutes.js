import express from 'express';
import { getGrowthTracking } from '../controllers/growthController.js';

const router = express.Router();

router.get('/:businessId', getGrowthTracking);

export default router;
