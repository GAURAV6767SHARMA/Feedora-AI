import express from 'express';
import {
  triggerAdvisor,
  getRecommendations,
  updateStatus
} from '../controllers/advisorController.js';

const router = express.Router();

router.post('/generate', triggerAdvisor);
router.get('/:businessId', getRecommendations);
router.patch('/status/:id', updateStatus);

export default router;
