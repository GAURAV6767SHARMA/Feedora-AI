import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const recommendationSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  problem: { type: String, required: true },
  reason: { type: String, required: true },
  action: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending',
    index: true 
  },
  expectedOutcome: { type: String, required: true },
  confidence: { type: String, default: 'High (Based on 12+ recurring mentions)' },
  limitations: { type: String, default: 'Review volume reflects subset of dine-in customers.' },
  pillar: { type: String, default: 'Operational Excellence' },
  financialImpact: { type: String, default: '+₹35,000 / mo Estimated Impact' },
  capitalRequired: { type: String, default: '₹5,000' },
  paybackHorizon: { type: String, default: '14 Days' },
  effort: { type: String, default: 'Quick Win' },
  sopSteps: [{ type: String }],
  evidenceReviewIds: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

recommendationSchema.index({ businessId: 1, status: 1 });
recommendationSchema.index({ businessId: 1, createdAt: -1 });

const MongooseRecommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export const Recommendation = new Proxy(MongooseRecommendation, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.recommendations) {
      const val = memoryStore.recommendations[prop];
      return typeof val === 'function' ? val.bind(memoryStore.recommendations) : val;
    }
    return target[prop];
  }
});

export default Recommendation;
