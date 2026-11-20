import {
  generateRecommendations,
  getBusinessRecommendations,
  updateRecommendationStatus
} from '../services/recommendationService.js';
import { recommendationUpdateSchema } from '../utils/validators.js';

export const triggerAdvisor = async (req, res, next) => {
  try {
    const { businessId } = req.body;
    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const recommendations = await generateRecommendations(businessId);
    res.status(201).json({
      success: true,
      message: `Generated ${recommendations.length} AI business recommendations.`,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const recommendations = await getBusinessRecommendations(businessId);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = recommendationUpdateSchema.parse(req.body);

    const updated = await updateRecommendationStatus(id, validated.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
