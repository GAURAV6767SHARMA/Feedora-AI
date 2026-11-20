import Review from '../models/Review.js';
import Business from '../models/Business.js';
import { calculateDemandSignals } from '../utils/demandScorer.js';

export const getBusinessDemandRadar = async (businessId) => {
  const business = await Business.findById(businessId);
  const reviews = await Review.find({ businessId }).exec();

  const signals = calculateDemandSignals(reviews);

  return {
    businessId,
    businessName: business?.name || 'Local Business',
    category: business?.category || 'general',
    totalReviewsAnalyzed: reviews.length,
    signalsCount: signals.length,
    signals,
    formulaExplanation: 'DemandScore = 0.4*Frequency + 0.3*Growth + 0.3*UniqueCustomers (Illustrative Ranking Heuristic)'
  };
};
