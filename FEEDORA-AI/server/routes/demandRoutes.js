import express from 'express';
import { getDemandRadar } from '../controllers/demandController.js';

const router = express.Router();

router.get('/:businessId', getDemandRadar);

export default router;
