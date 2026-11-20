import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const insightSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  dateRange: {
    start: { type: Date },
    end: { type: Date }
  },
  sentimentSummary: {
    total: { type: Number, default: 0 },
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    mixed: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  topTopics: [{
    name: { type: String },
    count: { type: Number },
    sentimentDistribution: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 }
    }
  }],
  topComplaints: [{
    category: { type: String },
    count: { type: Number },
    sampleEvidence: [{ type: String }]
  }],
  preferences: [{
    item: { type: String },
    count: { type: Number },
    sampleEvidence: [{ type: String }]
  }],
  demandSignals: [{
    item: { type: String },
    score: { type: Number },
    confidence: { type: String },
    trend: { type: String },
    mentions: { type: Number }
  }],
  analysisProvider: { type: String, default: 'Gemini' },
  generatedAt: { type: Date, default: Date.now }
});

insightSchema.index({ businessId: 1, generatedAt: -1 });

const MongooseInsight = mongoose.models.Insight || mongoose.model('Insight', insightSchema);

export const Insight = new Proxy(MongooseInsight, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.insights) {
      const val = memoryStore.insights[prop];
      return typeof val === 'function' ? val.bind(memoryStore.insights) : val;
    }
    return target[prop];
  }
});

export default Insight;
