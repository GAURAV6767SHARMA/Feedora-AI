import Business from '../models/Business.js';
import Review from '../models/Review.js';
import Insight from '../models/Insight.js';
import Recommendation from '../models/Recommendation.js';
import Campaign from '../models/Campaign.js';
import { businessCreateSchema, businessUpdateSchema } from '../utils/validators.js';
import { memoryStore } from '../models/store.js';
import { seedDemoData } from '../scripts/seedDemo.js';

export const createBusiness = async (req, res, next) => {
  try {
    const validated = businessCreateSchema.parse(req.body);
    const business = await Business.create(validated);
    res.status(201).json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
};

export const getBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 }).exec();
    res.json({ success: true, data: businesses });
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }
    res.json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (req, res, next) => {
  try {
    const validated = businessUpdateSchema.parse(req.body);
    const updated = await Business.findByIdAndUpdate(req.params.id, validated, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const resetDemoData = async (req, res, next) => {
  try {
    // Reset memory store
    memoryStore.reset();

    // Re-seed all three demo industries
    const restaurant = await seedDemoData('restaurant');
    await seedDemoData('salon');
    await seedDemoData('clothing');

    res.json({
      success: true,
      message: 'Demo workspace reset successfully with complete restaurant, salon, and boutique datasets.',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

export const seedDataset = async (req, res, next) => {
  try {
    const { datasetType = 'restaurant' } = req.params;
    const business = await seedDemoData(datasetType);
    res.json({
      success: true,
      message: `Seeded ${datasetType} demo dataset successfully.`,
      data: business
    });
  } catch (error) {
    next(error);
  }
};
