import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const reviewSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
  source: { type: String, default: 'Google' },
  normalizedTextHash: { type: String, required: true, index: true },
  language: { type: String, default: 'English' },
  sentiment: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral', 'mixed', 'unprocessed'], 
    default: 'unprocessed',
    index: true 
  },
  topics: [{
    name: { type: String },
    sentiment: { type: String },
    evidence: { type: String }
  }],
  complaints: [{ type: String }],
  preferences: [{ type: String }],
  featureRequests: [{ type: String }],
  demandSignals: [{ type: String }],
  evidence: { type: String, default: '' },
  customerName: { type: String, default: 'Anonymous Customer' },
  ownerReply: { type: String, default: '' },
  ownerRepliedAt: { type: Date, default: null },
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'low' 
  },
  analysisStatus: { 
    type: String, 
    enum: ['pending', 'analyzed', 'failed'], 
    default: 'pending',
    index: true
  },
  isDemo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ businessId: 1, createdAt: -1 });
reviewSchema.index({ businessId: 1, normalizedTextHash: 1 });
reviewSchema.index({ businessId: 1, sentiment: 1 });
reviewSchema.index({ businessId: 1, analysisStatus: 1 });

const MongooseReview = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export const Review = new Proxy(MongooseReview, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.reviews) {
      const val = memoryStore.reviews[prop];
      return typeof val === 'function' ? val.bind(memoryStore.reviews) : val;
    }
    return target[prop];
  }
});

export default Review;
