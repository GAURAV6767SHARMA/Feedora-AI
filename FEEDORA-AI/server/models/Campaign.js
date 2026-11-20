import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const campaignSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  platform: { 
    type: String, 
    required: true, 
    enum: ['Instagram', 'WhatsApp', 'Facebook', 'SMS', 'Reels'] 
  },
  language: { 
    type: String, 
    required: true, 
    enum: ['English', 'Hindi', 'Hinglish'] 
  },
  tone: { type: String, default: 'Friendly & Welcoming' },
  objective: { type: String, required: true },
  caption: { type: String, required: true },
  hashtags: [{ type: String }],
  campaignIdea: { type: String, default: '' },
  callToAction: { type: String, default: '' },
  contentRationale: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['draft', 'saved', 'scheduled', 'published'], 
    default: 'saved',
    index: true 
  },
  createdAt: { type: Date, default: Date.now }
});

campaignSchema.index({ businessId: 1, createdAt: -1 });

const MongooseCampaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export const Campaign = new Proxy(MongooseCampaign, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.campaigns) {
      const val = memoryStore.campaigns[prop];
      return typeof val === 'function' ? val.bind(memoryStore.campaigns) : val;
    }
    return target[prop];
  }
});

export default Campaign;
