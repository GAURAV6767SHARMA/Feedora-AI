import { setDynamicApiKey } from '../services/geminiService.js';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import Recommendation from '../models/Recommendation.js';
import Campaign from '../models/Campaign.js';
import Experiment from '../models/Experiment.js';
import { GoogleGenAI } from '@google/genai';

export const getSystemSettings = async (req, res, next) => {
  try {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
    res.json({
      success: true,
      data: {
        hasGeminiApiKey: hasKey,
        geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        keyMasked: hasKey ? `••••••••••••${process.env.GEMINI_API_KEY.slice(-4)}` : 'Not Set (Using Offline Fallback)',
        demoModeActive: process.env.ENABLE_DEMO_FALLBACK === 'true'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateGeminiKey = async (req, res, next) => {
  try {
    const { apiKey, model = 'gemini-1.5-flash' } = req.body;
    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ success: false, error: 'API key is required' });
    }

    const trimmedKey = apiKey.trim();

    // Verify key by making a lightweight test call
    try {
      const ai = new GoogleGenAI({ apiKey: trimmedKey });
      await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: 'Respond with OK' }] }]
      });
    } catch (testErr) {
      return res.status(400).json({
        success: false,
        error: `Gemini API key verification failed: ${testErr.message}`
      });
    }

    setDynamicApiKey(trimmedKey);
    process.env.GEMINI_MODEL = model;

    res.json({
      success: true,
      message: 'Gemini API Key successfully verified and activated!',
      data: {
        model,
        keyMasked: `••••••••••••${trimmedKey.slice(-4)}`
      }
    });
  } catch (error) {
    next(error);
  }
};

export const exportBusinessData = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const reviews = await Review.find({ businessId }).exec();
    const recommendations = await Recommendation.find({ businessId }).exec();
    const campaigns = await Campaign.find({ businessId }).exec();
    const experiments = await Experiment.find({ businessId }).exec();

    res.json({
      success: true,
      exportedAt: new Date().toISOString(),
      business,
      reviewsCount: reviews.length,
      data: {
        business,
        reviews,
        recommendations,
        campaigns,
        experiments
      }
    });
  } catch (error) {
    next(error);
  }
};
