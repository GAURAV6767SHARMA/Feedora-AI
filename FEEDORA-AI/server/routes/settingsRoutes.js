import express from 'express';
import {
  getSystemSettings,
  updateGeminiKey,
  exportBusinessData
} from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSystemSettings);
router.post('/gemini-key', updateGeminiKey);
router.get('/export/:businessId', exportBusinessData);

export default router;
