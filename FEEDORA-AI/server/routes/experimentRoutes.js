import express from 'express';
import {
  createExperiment,
  getExperiments,
  updateExperiment
} from '../controllers/experimentController.js';

const router = express.Router();

router.post('/', createExperiment);
router.get('/:businessId', getExperiments);
router.patch('/:id', updateExperiment);

export default router;
