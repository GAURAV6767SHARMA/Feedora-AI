import { runReviewAnalysis } from '../services/reviewAnalysisService.js';
import Review from '../models/Review.js';
import { aggregateSentiment } from '../utils/sentimentAggregator.js';
import { calculateDemandSignals } from '../utils/demandScorer.js';

export const triggerAnalysis = async (req, res, next) => {
  try {
    const { businessId, forceAll = false } = req.body;
    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const result = await runReviewAnalysis(businessId, forceAll);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisSummary = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.find({ businessId }).exec();

    const summary = aggregateSentiment(reviews);
    const demandSignals = calculateDemandSignals(reviews);

    res.json({
      success: true,
      data: {
        ...summary,
        demandSignals: demandSignals.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisTrends = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.find({ businessId }).exec();

    const summary = aggregateSentiment(reviews);

    res.json({
      success: true,
      data: {
        businessId,
        trends: summary.monthlyTrends,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};
