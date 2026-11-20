import express from 'express';
import {
  uploadReviewsCsv,
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
  draftReviewReply,
  saveReviewReply,
  submitPublicReview,
  getUrgentReviews
} from '../controllers/reviewController.js';
import { uploadCsv } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', uploadCsv, uploadReviewsCsv);
router.post('/public', submitPublicReview);
router.get('/urgent/:businessId', getUrgentReviews);

router.route('/')
  .post(createReview)
  .get(getReviews);

router.post('/:id/draft-reply', draftReviewReply);
router.patch('/:id/reply', saveReviewReply);

router.route('/:id')
  .get(getReviewById)
  .delete(deleteReview);

export default router;
