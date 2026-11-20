import Recommendation from '../models/Recommendation.js';
import Review from '../models/Review.js';
import { aggregateSentiment } from '../utils/sentimentAggregator.js';

export const getGrowthTracking = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const recommendations = await Recommendation.find({ businessId }).sort({ createdAt: -1 }).exec();
    const reviews = await Review.find({ businessId }).sort({ date: 1 }).exec();

    const totalRecs = recommendations.length;
    const completedRecs = recommendations.filter(r => r.status === 'completed');
    const inProgressRecs = recommendations.filter(r => r.status === 'in-progress');
    const pendingRecs = recommendations.filter(r => r.status === 'pending');

    // Split reviews into earlier vs recent for comparison
    const midPoint = Math.floor(reviews.length / 2);
    const earlierReviews = reviews.slice(0, midPoint);
    const recentReviews = reviews.slice(midPoint);

    const earlierAgg = aggregateSentiment(earlierReviews);
    const recentAgg = aggregateSentiment(recentReviews);

    // Complaint trend comparison
    const complaintComparison = [];
    const allComplaintKeys = new Set([
      ...earlierAgg.topComplaints.map(c => c.category),
      ...recentAgg.topComplaints.map(c => c.category)
    ]);

    for (const key of allComplaintKeys) {
      const earlierMatch = earlierAgg.topComplaints.find(c => c.category === key);
      const recentMatch = recentAgg.topComplaints.find(c => c.category === key);
      const earlierCount = earlierMatch ? earlierMatch.count : 0;
      const recentCount = recentMatch ? recentMatch.count : 0;

      let trend = 'unchanged';
      if (recentCount < earlierCount) trend = 'reduced';
      else if (recentCount > earlierCount) trend = 'increased';

      complaintComparison.push({
        category: key,
        earlierPeriodCount: earlierCount,
        recentPeriodCount: recentCount,
        trend
      });
    }

    // Action History
    const actionHistory = recommendations.map(r => ({
      id: r._id,
      title: r.title,
      priority: r.priority,
      status: r.status,
      action: r.action,
      createdAt: r.createdAt,
      completedAt: r.completedAt
    }));

    res.json({
      success: true,
      data: {
        businessId,
        metrics: {
          totalRecommendations: totalRecs,
          completedCount: completedRecs.length,
          inProgressCount: inProgressRecs.length,
          pendingCount: pendingRecs.length,
          completionRate: totalRecs > 0 ? Math.round((completedRecs.length / totalRecs) * 100) : 0
        },
        sampleSizes: {
          totalReviews: reviews.length,
          earlierPeriodReviews: earlierReviews.length,
          recentPeriodReviews: recentReviews.length,
          earlierDateRange: earlierReviews.length > 0 ? {
            from: earlierReviews[0].date || earlierReviews[0].createdAt,
            to: earlierReviews[earlierReviews.length - 1].date || earlierReviews[earlierReviews.length - 1].createdAt
          } : null,
          recentDateRange: recentReviews.length > 0 ? {
            from: recentReviews[0].date || recentReviews[0].createdAt,
            to: recentReviews[recentReviews.length - 1].date || recentReviews[recentReviews.length - 1].createdAt
          } : null
        },
        periodComparison: {
          earlierRating: earlierAgg.averageRating,
          recentRating: recentAgg.averageRating,
          ratingDelta: Number((recentAgg.averageRating - earlierAgg.averageRating).toFixed(2)),
          earlierPositivePct: earlierAgg.sentimentSummary.positivePercent,
          recentPositivePct: recentAgg.sentimentSummary.positivePercent,
          positiveDelta: recentAgg.sentimentSummary.positivePercent - earlierAgg.sentimentSummary.positivePercent,
          earlierNegativePct: earlierAgg.sentimentSummary.negativePercent,
          recentNegativePct: recentAgg.sentimentSummary.negativePercent,
          negativeDelta: recentAgg.sentimentSummary.negativePercent - earlierAgg.sentimentSummary.negativePercent
        },
        complaintComparison: complaintComparison.slice(0, 6),
        actionHistory,
        scientificDisclaimer: 'Observational Data Note: Period-over-period comparisons reflect sample trends. Improvement should not be inferred as solely caused by implemented actions without controlled A/B testing.'
      }
    });
  } catch (error) {
    next(error);
  }
};
