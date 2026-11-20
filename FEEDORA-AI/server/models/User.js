import mongoose from 'mongoose';
import { memoryStore } from './store.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firebaseUid: { type: String, default: null },
  isDemoUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

export const User = new Proxy(MongooseUser, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryStore.users) {
      const val = memoryStore.users[prop];
      return typeof val === 'function' ? val.bind(memoryStore.users) : val;
    }
    return target[prop];
  }
});

export default User;
