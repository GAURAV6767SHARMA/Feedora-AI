import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;
let isMemoryStoreActive = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ [Database] No MONGODB_URI provided. Initializing High-Performance In-Memory & File-Backed Demo Store.');
    isMemoryStoreActive = true;
    return false;
  }

  try {
    console.log(`[Database] Attempting connection to MongoDB...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    isMemoryStoreActive = false;
    console.log('\x1b[32m%s\x1b[0m', `✓ [Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠ [Database] MongoDB connection failed (${error.message}). Falling back to In-Memory & File-Backed Demo Store.`);
    isConnected = false;
    isMemoryStoreActive = true;
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  isMemoryStore: isMemoryStoreActive,
  provider: isConnected ? 'MongoDB Atlas' : 'LocalPulse In-Memory Store (Zero-Friction Fallback)'
});
