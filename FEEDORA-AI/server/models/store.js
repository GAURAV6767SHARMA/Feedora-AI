import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let store = {
  users: [],
  businesses: [],
  reviews: [],
  insights: [],
  recommendations: [],
  campaigns: [],
  experiments: [],
  settings: []
};

// Load initial store if exists
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    store = { ...store, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('[Store] Could not read existing store.json, initializing fresh store:', err.message);
  }
}

const saveStore = () => {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('[Store] Failed to persist store to disk:', err.message);
  }
};

class MemoryCollection {
  constructor(name) {
    this.name = name;
  }

  get data() {
    if (!store[this.name]) {
      store[this.name] = [];
    }
    return store[this.name];
  }

  _matchesQuery(item, query = {}) {
    for (const [key, val] of Object.entries(query)) {
      if (key === '_id' || key === 'id') {
        const itemId = String(item._id || item.id);
        const queryId = String(val?._id || val);
        if (itemId !== queryId) return false;
        continue;
      }

      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (val.$regex) {
          const regex = new RegExp(val.$regex, val.$options || 'i');
          if (!regex.test(String(item[key] || ''))) return false;
          continue;
        }
        if (val.$in && Array.isArray(val.$in)) {
          if (!val.$in.map(String).includes(String(item[key]))) return false;
          continue;
        }
        if (val.$ne !== undefined) {
          if (item[key] === val.$ne) return false;
          continue;
        }
        if (val.$gt !== undefined && !(item[key] > val.$gt)) return false;
        if (val.$gte !== undefined && !(item[key] >= val.$gte)) return false;
        if (val.$lt !== undefined && !(item[key] < val.$lt)) return false;
        if (val.$lte !== undefined && !(item[key] <= val.$lte)) return false;
      } else if (item[key] !== val) {
        return false;
      }
    }
    return true;
  }

  find(query = {}) {
    let results = this.data.filter(item => this._matchesQuery(item, query));
    
    const queryObj = {
      _results: results,
      sort(sortObj) {
        if (sortObj) {
          const [key, direction] = Object.entries(sortObj)[0];
          results.sort((a, b) => {
            const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
            const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
            if (valA < valB) return direction === -1 ? 1 : -1;
            if (valA > valB) return direction === -1 ? -1 : 1;
            return 0;
          });
        }
        return queryObj;
      },
      skip(n) {
        results = results.slice(n);
        return queryObj;
      },
      limit(n) {
        results = results.slice(0, n);
        return queryObj;
      },
      select(fields) {
        return queryObj;
      },
      lean() {
        return [...results];
      },
      async exec() {
        return [...results];
      },
      then(resolve, reject) {
        return Promise.resolve([...results]).then(resolve, reject);
      }
    };

    return queryObj;
  }

  async findOne(query = {}) {
    const item = this.data.find(it => this._matchesQuery(it, query));
    return item ? { ...item } : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    if (Array.isArray(doc)) {
      return this.insertMany(doc);
    }
    const newDoc = {
      _id: doc._id || crypto.randomUUID(),
      createdAt: doc.createdAt || new Date(),
      updatedAt: new Date(),
      ...doc
    };
    this.data.push(newDoc);
    saveStore();
    return { ...newDoc };
  }

  async insertMany(docs) {
    const created = docs.map(doc => ({
      _id: doc._id || crypto.randomUUID(),
      createdAt: doc.createdAt || new Date(),
      updatedAt: new Date(),
      ...doc
    }));
    this.data.push(...created);
    saveStore();
    return created.map(d => ({ ...d }));
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.data.findIndex(it => String(it._id) === String(id));
    if (index === -1) return null;

    const current = this.data[index];
    const updatePayload = update.$set ? { ...update.$set } : { ...update };
    delete updatePayload.$set;

    const updated = {
      ...current,
      ...updatePayload,
      updatedAt: new Date()
    };
    this.data[index] = updated;
    saveStore();
    return { ...updated };
  }

  async updateOne(query, update) {
    const index = this.data.findIndex(it => this._matchesQuery(it, query));
    if (index === -1) return { matchedCount: 0, modifiedCount: 0 };
    const current = this.data[index];
    const updatePayload = update.$set ? { ...update.$set } : { ...update };
    this.data[index] = { ...current, ...updatePayload, updatedAt: new Date() };
    saveStore();
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex(it => String(it._id) === String(id));
    if (index === -1) return null;
    const removed = this.data.splice(index, 1)[0];
    saveStore();
    return { ...removed };
  }

  async deleteMany(query = {}) {
    const initialLen = this.data.length;
    store[this.name] = this.data.filter(it => !this._matchesQuery(it, query));
    const deletedCount = initialLen - store[this.name].length;
    saveStore();
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    return this.data.filter(it => this._matchesQuery(it, query)).length;
  }

  async distinct(field, query = {}) {
    const items = this.data.filter(it => this._matchesQuery(it, query));
    const set = new Set();
    for (const item of items) {
      if (item[field] !== undefined) set.add(item[field]);
    }
    return Array.from(set);
  }
}

export const memoryStore = {
  users: new MemoryCollection('users'),
  businesses: new MemoryCollection('businesses'),
  reviews: new MemoryCollection('reviews'),
  insights: new MemoryCollection('insights'),
  recommendations: new MemoryCollection('recommendations'),
  campaigns: new MemoryCollection('campaigns'),
  experiments: new MemoryCollection('experiments'),
  settings: new MemoryCollection('settings'),
  reset() {
    store = {
      users: [],
      businesses: [],
      reviews: [],
      insights: [],
      recommendations: [],
      campaigns: [],
      experiments: [],
      settings: []
    };
    saveStore();
  }
};
