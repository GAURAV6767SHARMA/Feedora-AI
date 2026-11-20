import express from 'express';
import {
  triggerAnalysis,
  getAnalysisSummary,
  getAnalysisTrends
} from '../controllers/analysisController.js';

const router = express.Router();

router.post('/run', triggerAnalysis);
router.get('/summary/:businessId', getAnalysisSummary);
router.get('/trends/:businessId', getAnalysisTrends);

export default router;
