import {
  generateMarketingCampaign,
  saveCampaign,
  getBusinessCampaigns,
  updateCampaignStatus
} from '../services/marketingService.js';
import { marketingGenerateSchema, campaignUpdateSchema } from '../utils/validators.js';

export const generateContent = async (req, res, next) => {
  try {
    const validated = marketingGenerateSchema.parse(req.body);
    const content = await generateMarketingCampaign(validated);
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { businessId, platform, language, tone, objective, caption, hashtags, campaignIdea, callToAction, contentRationale, status } = req.body;

    if (!businessId || !caption) {
      return res.status(400).json({ success: false, error: 'businessId and caption are required' });
    }

    const campaign = await saveCampaign({
      businessId,
      platform: platform || 'Instagram',
      language: language || 'English',
      tone: tone || 'Warm & Engaging',
      objective: objective || 'Drive Local Footfall',
      caption,
      hashtags: hashtags || [],
      campaignIdea: campaignIdea || '',
      callToAction: callToAction || '',
      contentRationale: contentRationale || '',
      status: status || 'saved'
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const getCampaigns = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const campaigns = await getBusinessCampaigns(businessId);
    res.json({ success: true, data: campaigns });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = campaignUpdateSchema.parse(req.body);

    const updated = await updateCampaignStatus(id, validated);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
