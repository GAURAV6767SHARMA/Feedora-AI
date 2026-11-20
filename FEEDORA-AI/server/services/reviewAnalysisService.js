import Review from '../models/Review.js';
import Insight from '../models/Insight.js';
import { analyzeReviewsWithGemini } from './geminiService.js';
import { aggregateSentiment } from '../utils/sentimentAggregator.js';
import { calculateDemandSignals } from '../utils/demandScorer.js';

export const runReviewAnalysis = async (businessId, forceAll = false) => {
  // Query reviews for this business
  const query = { businessId };
  if (!forceAll) {
    query.analysisStatus = { $ne: 'analyzed' };
  }

  let reviewsToProcess = await Review.find(query).exec();

  if (reviewsToProcess.length === 0 && !forceAll) {
    // If all are already analyzed, fetch all to return latest insight summary
    const allReviews = await Review.find({ businessId }).exec();
    const existingInsight = await Insight.findOne({ businessId });
    const aggregated = aggregateSentiment(allReviews);
    const demandSignals = calculateDemandSignals(allReviews);

    return {
      message: 'All reviews are already analyzed.',
      analyzedCount: 0,
      totalReviews: allReviews.length,
      insights: existingInsight || {
        businessId,
        ...aggregated,
        demandSignals,
        generatedAt: new Date()
      }
    };
  }

  // If forceAll, use all reviews
  if (forceAll) {
    reviewsToProcess = await Review.find({ businessId }).exec();
  }

  const batchSize = 15;
  const analysisResults = [];
  let isDemoFallback = false;
  let provider = 'Gemini';

  for (let i = 0; i < reviewsToProcess.length; i += batchSize) {
    const batch = reviewsToProcess.slice(i, i + batchSize);
    const batchRes = await analyzeReviewsWithGemini(batch);
    if (batchRes.isDemoFallback) {
      isDemoFallback = true;
      provider = batchRes.provider;
    }
    analysisResults.push(...batchRes.results);
  }

  // Update Review documents in DB
  for (const item of analysisResults) {
    await Review.findByIdAndUpdate(item.reviewId, {
      sentiment: item.sentiment,
      language: item.language,
      topics: item.topics,
      complaints: item.complaints,
      preferences: item.preferences,
      featureRequests: item.featureRequests,
      demandSignals: item.demandSignals,
      analysisStatus: 'analyzed',
      evidence: item.topics?.[0]?.evidence || ''
    });
  }

  // Fetch all refreshed reviews for complete aggregation
  const allReviewsRefreshed = await Review.find({ businessId }).exec();
  const aggregated = aggregateSentiment(allReviewsRefreshed);
  const demandSignals = calculateDemandSignals(allReviewsRefreshed);

  const insightData = {
    businessId,
    sentimentSummary: {
      total: aggregated.total,
      positive: aggregated.sentimentSummary.positive,
      negative: aggregated.sentimentSummary.negative,
      neutral: aggregated.sentimentSummary.neutral,
      mixed: aggregated.sentimentSummary.mixed,
      averageRating: aggregated.averageRating
    },
    topTopics: aggregated.topTopics,
    topComplaints: aggregated.topComplaints,
    preferences: aggregated.topPreferences,
    demandSignals,
    analysisProvider: provider,
    generatedAt: new Date()
  };

  const existing = await Insight.findOne({ businessId });
  let savedInsight;
  if (existing) {
    savedInsight = await Insight.findByIdAndUpdate(existing._id, insightData, { new: true });
  } else {
    savedInsight = await Insight.create(insightData);
  }

  return {
    message: `Successfully analyzed ${analysisResults.length} reviews.`,
    analyzedCount: analysisResults.length,
    totalReviews: allReviewsRefreshed.length,
    isDemoFallback,
    provider,
    insights: savedInsight,
    summary: aggregated
  };
};
