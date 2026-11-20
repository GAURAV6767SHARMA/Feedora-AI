import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const experimentSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  demandSignalTitle: { type: String, required: true },
  hypothesis: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['planning', 'active', 'completed', 'cancelled'], 
    default: 'active',
    index: true 
  },
  projectedCost: { type: Number, default: 0 },
  projectedRevenue: { type: Number, default: 0 },
  actualRevenue: { type: Number, default: 0 },
  customerFeedbackCount: { type: Number, default: 0 },
  outcomeNotes: { type: String, default: '' },
  decision: { 
    type: String, 
    enum: ['pending', 'adopted', 'rejected', 'inconclusive'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

experimentSchema.index({ businessId: 1, status: 1 });

const MongooseExperiment = mongoose.models.Experiment || mongoose.model('Experiment', experimentSchema);

// Register in memoryStore as well
if (!memoryStore.experiments) {
  memoryStore.experiments = new (memoryStore.users.constructor)('experiments');
}

export const Experiment = new Proxy(MongooseExperiment, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.experiments) {
      const val = memoryStore.experiments[prop];
      return typeof val === 'function' ? val.bind(memoryStore.experiments) : val;
    }
    return target[prop];
  }
});

export default Experiment;
