import express from 'express';
import {
  generateContent,
  createCampaign,
  getCampaigns,
  updateCampaign
} from '../controllers/marketingController.js';

const router = express.Router();

// Generate campaign copy via AI
router.post('/generate', generateContent);

// Support both /api/v1/campaigns and /api/v1/marketing/campaigns
router.route('/')
  .post(createCampaign);

router.route('/campaigns')
  .post(createCampaign);

router.route('/:businessId')
  .get(getCampaigns);

router.route('/campaigns/:businessId')
  .get(getCampaigns);

router.route('/:id')
  .patch(updateCampaign);

router.route('/campaigns/:id')
  .patch(updateCampaign);

export default router;
