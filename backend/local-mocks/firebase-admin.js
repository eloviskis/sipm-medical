/**
 * Local mock for firebase-admin that uses lowdb for Firestore and JWT for Auth.
 * This replaces the real firebase-admin at runtime via module-alias.
 */

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'sipm-local-secret-key-2024';
const DB_PATH = path.join(__dirname, '..', 'local-db.json');

// Initialize lowdb
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// Set defaults for all collections
db.defaults({
  users: [],
  appointments: [],
  clinics: [],
  files: [],
  pages: [],
  themes: [],
  patientRecords: [],
  invoices: [],
  messages: [],
  reports: [],
  whatsapp: [],
  themePreferences: [],
  payments: [],
  documentTemplates: [],
  preConsultations: [],
  motivos: [],
  accountsReceivable: [],
  accountsPayable: [],
  notifications: [],
  profiles: [],
  feedItems: [],
  homePageContent: [],
  settings: [],
  passwordResetTokens: [],
  permissions: [],
}).write();

// --- DocumentSnapshot ---
class DocumentSnapshot {
  constructor(id, data) {
    this._id = id;
    this._data = data || null;
  }
  get exists() {
    return this._data !== null && this._data !== undefined;
  }
  get id() {
    return this._id;
  }
  data() {
    return this._data ? { ...this._data } : undefined;
  }
}

// --- QuerySnapshot ---
class QuerySnapshot {
  constructor(docs) {
    this.docs = docs;
    this.empty = docs.length === 0;
    this.size = docs.length;
  }
  forEach(callback) {
    this.docs.forEach(callback);
  }
}

// --- Query (for where chains) ---
class Query {
  constructor(collectionName, filters) {
    this._collectionName = collectionName;
    this._filters = filters || [];
  }

  where(field, op, value) {
    return new Query(this._collectionName, [
      ...this._filters,
      { field, op, value },
    ]);
  }

  orderBy() {
    return this; // no-op for local
  }

  limit() {
    return this; // no-op for local
  }

  async get() {
    let items = db.get(this._collectionName).value() || [];

    for (const filter of this._filters) {
      items = items.filter((item) => {
        const val = getNestedValue(item, filter.field);
        switch (filter.op) {
          case '==':
            return val === filter.value;
          case '!=':
            return val !== filter.value;
          case '>':
            return val > filter.value;
          case '>=':
            return val >= filter.value;
          case '<':
            return val < filter.value;
          case '<=':
            return val <= filter.value;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(val);
          case 'array-contains':
            return Array.isArray(val) && val.includes(filter.value);
          default:
            return true;
        }
      });
    }

    const docs = items.map(
      (item) => new DocumentSnapshot(item._id || item.id, item)
    );
    return new QuerySnapshot(docs);
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

// --- DocumentReference ---
class DocumentReference {
  constructor(collectionName, id) {
    this._collectionName = collectionName;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  collection(subName) {
    // Support subcollections as flat collection: parentCollection_subCollection
    return new CollectionReference(`${this._collectionName}_${this._id}_${subName}`);
  }

  async get() {
    const item = db
      .get(this._collectionName)
      .find((i) => (i._id || i.id) === this._id)
      .value();
    return new DocumentSnapshot(this._id, item || null);
  }

  async set(data, options) {
    const existing = db
      .get(this._collectionName)
      .find((i) => (i._id || i.id) === this._id)
      .value();

    if (existing) {
      if (options && options.merge) {
        const merged = { ...existing, ...data, _id: this._id };
        db.get(this._collectionName)
          .find((i) => (i._id || i.id) === this._id)
          .assign(merged)
          .write();
      } else {
        db.get(this._collectionName)
          .find((i) => (i._id || i.id) === this._id)
          .assign({ ...data, _id: this._id })
          .write();
      }
    } else {
      // Ensure collection exists
      if (!db.has(this._collectionName).value()) {
        db.set(this._collectionName, []).write();
      }
      db.get(this._collectionName)
        .push({ ...data, _id: this._id })
        .write();
    }
  }

  async update(data) {
    const existing = db
      .get(this._collectionName)
      .find((i) => (i._id || i.id) === this._id)
      .value();

    if (!existing) {
      throw new Error(`Document ${this._id} not found in ${this._collectionName}`);
    }

    db.get(this._collectionName)
      .find((i) => (i._id || i.id) === this._id)
      .assign({ ...existing, ...data })
      .write();
  }

  async delete() {
    db.get(this._collectionName)
      .remove((i) => (i._id || i.id) === this._id)
      .write();
  }
}

// --- CollectionReference ---
class CollectionReference extends Query {
  constructor(name) {
    super(name, []);
    this._name = name;
  }

  doc(id) {
    const docId = id || uuidv4();
    return new DocumentReference(this._name, docId);
  }

  async add(data) {
    const id = uuidv4();
    if (!db.has(this._name).value()) {
      db.set(this._name, []).write();
    }
    db.get(this._name)
      .push({ ...data, _id: id })
      .write();
    return new DocumentReference(this._name, id);
  }

  async get() {
    const items = db.get(this._name).value() || [];
    const docs = items.map(
      (item) => new DocumentSnapshot(item._id || item.id, item)
    );
    return new QuerySnapshot(docs);
  }
}

// --- Mock Firestore ---
class MockFirestore {
  collection(name) {
    return new CollectionReference(name);
  }
  settings() {
    // no-op
  }
  doc(path) {
    // Support paths like "collection/docId"
    const parts = path.split('/');
    if (parts.length >= 2) {
      return new DocumentReference(parts[0], parts[1]);
    }
    throw new Error('Invalid document path: ' + path);
  }
}

const firestoreInstance = new MockFirestore();

// --- Mock Auth ---
class MockAuth {
  async createUser({ email, password, displayName }) {
    const uid = uuidv4();
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Store in users collection
    if (!db.has('_authUsers').value()) {
      db.set('_authUsers', []).write();
    }
    db.get('_authUsers')
      .push({
        uid,
        email,
        password: hashedPassword,
        displayName: displayName || '',
        providerData: [{ providerId: 'password' }],
      })
      .write();

    return { uid, email, displayName };
  }

  async getUserByEmail(email) {
    const user = db.get('_authUsers').find({ email }).value();
    if (!user) {
      const error = new Error('User not found');
      error.code = 'auth/user-not-found';
      throw error;
    }
    return user;
  }

  async getUser(uid) {
    const user = db.get('_authUsers').find({ uid }).value();
    if (!user) {
      const error = new Error('User not found');
      error.code = 'auth/user-not-found';
      throw error;
    }
    return user;
  }

  async updateUser(uid, data) {
    const user = db.get('_authUsers').find({ uid }).value();
    if (!user) {
      throw new Error('User not found');
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    db.get('_authUsers').find({ uid }).assign({ ...user, ...data }).write();
    return { ...user, ...data };
  }

  async deleteUser(uid) {
    db.get('_authUsers').remove({ uid }).write();
  }

  async verifyIdToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  async verifySessionCookie(token) {
    return this.verifyIdToken(token);
  }

  async createCustomToken(uid) {
    const user = db.get('_authUsers').find({ uid }).value();
    return jwt.sign(
      { uid, email: user?.email, name: user?.displayName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async generatePasswordResetLink(email) {
    return `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}&token=${uuidv4()}`;
  }
}

const authInstance = new MockAuth();

// --- The main admin mock ---
const admin = {
  _initialized: false,

  initializeApp(config) {
    if (!admin._initialized) {
      admin._initialized = true;
      console.log('[LOCAL] Firebase Admin initialized (local mock)');
    }
    return admin;
  },

  credential: {
    applicationDefault() {
      return {};
    },
    cert(serviceAccount) {
      return {};
    },
  },

  firestore: Object.assign(
    function () {
      return firestoreInstance;
    },
    {
      FieldValue: {
        serverTimestamp() {
          return new Date().toISOString();
        },
        increment(n) {
          return { __increment: n };
        },
        arrayUnion(...elements) {
          return { __arrayUnion: elements };
        },
        arrayRemove(...elements) {
          return { __arrayRemove: elements };
        },
        delete() {
          return { __delete: true };
        },
      },
      Timestamp: {
        now() {
          return { toDate: () => new Date(), seconds: Math.floor(Date.now() / 1000) };
        },
        fromDate(date) {
          return { toDate: () => date, seconds: Math.floor(date.getTime() / 1000) };
        },
      },
    }
  ),

  auth() {
    return authInstance;
  },

  storage() {
    return {
      bucket(name) {
        return new MockBucket(name);
      },
    };
  },
};

// --- Mock Storage Bucket ---
class MockBucket {
  constructor(name) {
    this.name = name || 'local-bucket';
  }
  file(filePath) {
    return new MockFile(this.name, filePath);
  }
  upload(localPath, options) {
    console.log(`[LOCAL] Uploaded ${localPath} to bucket ${this.name}`);
    return [new MockFile(this.name, options?.destination || localPath)];
  }
}

class MockFile {
  constructor(bucket, filePath) {
    this.bucket = bucket;
    this.filePath = filePath;
  }
  async getSignedUrl(config) {
    return [`http://localhost:3001/uploads/${this.filePath}`];
  }
  async save(data) {
    console.log(`[LOCAL] Saved file ${this.filePath}`);
  }
  async delete() {
    console.log(`[LOCAL] Deleted file ${this.filePath}`);
  }
  async exists() {
    return [false];
  }
  createWriteStream() {
    const { Writable } = require('stream');
    return new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });
  }
}

// Support both default and named exports
module.exports = admin;
module.exports.default = admin;
module.exports.__esModule = true;
