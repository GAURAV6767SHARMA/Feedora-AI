import express from 'express';
import {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  resetDemoData,
  seedDataset
} from '../controllers/businessController.js';

const router = express.Router();

router.route('/')
  .post(createBusiness)
  .get(getBusinesses);

router.post('/demo/reset', resetDemoData);
router.post('/seed/:datasetType', seedDataset);

router.route('/:id')
  .get(getBusinessById)
  .patch(updateBusiness);

export default router;
