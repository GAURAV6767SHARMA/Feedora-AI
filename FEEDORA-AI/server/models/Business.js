import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const businessSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['restaurant', 'salon', 'clothing', 'cafe', 'retail', 'services', 'other'],
    default: 'restaurant' 
  },
  description: { type: String, default: '' },
  location: { type: String, default: 'Bangalore, India' },
  preferredLanguage: { 
    type: String, 
    enum: ['English', 'Hindi', 'Hinglish'], 
    default: 'English' 
  },
  isDemo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

businessSchema.index({ createdAt: -1 });

const MongooseBusiness = mongoose.models.Business || mongoose.model('Business', businessSchema);

export const Business = new Proxy(MongooseBusiness, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.businesses) {
      const val = memoryStore.businesses[prop];
      return typeof val === 'function' ? val.bind(memoryStore.businesses) : val;
    }
    return target[prop];
  }
});

export default Business;
