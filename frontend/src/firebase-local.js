/**
 * Local Firebase mock for frontend development.
 * Intercepts Firebase Auth and Firestore calls, routing them through the local backend API.
 */

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// ===== Auth Mock =====
class LocalAuth {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('sipm_user') || 'null');
    this._listeners = [];
  }

  onAuthStateChanged(callback) {
    this._listeners.push(callback);
    // Fire immediately with current state
    setTimeout(() => callback(this.currentUser), 0);
    return () => {
      this._listeners = this._listeners.filter(l => l !== callback);
    };
  }

  _notifyListeners() {
    this._listeners.forEach(cb => cb(this.currentUser));
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const token = response.data.token;
      
      // Decode token to get user info (JWT payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const user = {
        uid: payload.uid,
        email: payload.email || email,
        displayName: payload.name || email.split('@')[0],
        accessToken: token,
        getIdToken: async () => token,
      };
      
      this.currentUser = user;
      localStorage.setItem('sipm_user', JSON.stringify(user));
      localStorage.setItem('sipm_token', token);
      this._notifyListeners();
      
      return { user };
    } catch (error) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  async createUserWithEmailAndPassword(email, password) {
    try {
      const response = await axios.post(`${API_BASE}/users/users`, { 
        email, 
        password, 
        name: email.split('@')[0],
        role: 'Paciente',
        consent: true,
      });
      
      const token = response.data.token || localStorage.getItem('sipm_token');
      const user = {
        uid: response.data.id,
        email,
        displayName: email.split('@')[0],
        accessToken: token,
        getIdToken: async () => token,
      };
      
      this.currentUser = user;
      localStorage.setItem('sipm_user', JSON.stringify(user));
      this._notifyListeners();
      
      return { user };
    } catch (error) {
      throw new Error('Erro ao criar conta.');
    }
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('sipm_user');
    localStorage.removeItem('sipm_token');
    this._notifyListeners();
  }

  async sendPasswordResetEmail(email) {
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    } catch (error) {
      console.warn('Password reset request failed:', error);
    }
  }
}

const authInstance = new LocalAuth();

// ===== Firestore Mock =====
// Wraps local backend API calls to mimic Firestore SDK

class LocalFirestore {
  collection(name) {
    return new CollectionRef(name);
  }
}

class CollectionRef {
  constructor(name) {
    this._name = name;
    this._filters = [];
  }

  doc(id) {
    return new DocRef(this._name, id);
  }

  where(field, op, value) {
    const newRef = new CollectionRef(this._name);
    newRef._filters = [...this._filters, { field, op, value }];
    return newRef;
  }

  orderBy() {
    return this;
  }

  limit() {
    return this;
  }
}

class DocRef {
  constructor(collection, id) {
    this._collection = collection;
    this._id = id;
    this.id = id;  
  }
}

// Map collection names to API endpoints
function collectionToEndpoint(name) {
  const map = {
    'users': '/users/users',
    'appointments': '/appointments/appointments',
    'services': '/services',
    'motivos': '/motivos/motivos',
    'documentTemplates': '/document-templates/document-templates',
    'preConsultations': '/pre-consultations/pre-consultations',
    'patientRecords': '/patient-records/patient-records',
    'messages': '/messages/messages',
    'notifications': '/notifications',
    'payments': '/payments/payments',
    'reports': '/reports/reports',
    'accountsReceivable': '/accounts-receivable/accounts-receivable',
    'accountsPayable': '/accounts-payable/accounts-payable',
    'settings': '/customization',
    'clinics': '/clinics/clinics',
    'homePageContent': '/home-page-content',
    'feedItems': '/feed/feed',
    'themes': '/themes/themes',
    'pages': '/pages/pages',
    'profiles': '/profile/profile',
  };
  return map[name] || `/${name}`;
}

const firestoreInstance = new LocalFirestore();

// ===== Exported Firebase SDK API =====

// firebase/app
export function initializeApp(config) {
  return { name: '[DEFAULT]', options: config };
}

export function getApp() {
  return { name: '[DEFAULT]' };
}

// firebase/auth
export function getAuth(app) {
  return authInstance;
}

export function onAuthStateChanged(auth, callback) {
  return auth.onAuthStateChanged(callback);
}

export async function signInWithEmailAndPassword(auth, email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

export async function createUserWithEmailAndPassword(auth, email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

export async function signOut(auth) {
  return auth.signOut();
}

export async function sendPasswordResetEmail(auth, email) {
  return auth.sendPasswordResetEmail(email);
}

// firebase/firestore
export function getFirestore(app) {
  return firestoreInstance;
}

export function collection(db, name) {
  return new CollectionRef(name);
}

export function doc(db, collectionName, docId) {
  if (docId) {
    return new DocRef(collectionName, docId);
  }
  // Handle doc(db, "collection/docId") format
  const parts = collectionName.split('/');
  return new DocRef(parts[0], parts[1]);
}

export async function getDoc(docRef) {
  try {
    const endpoint = collectionToEndpoint(docRef._collection);
    const token = localStorage.getItem('sipm_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE}${endpoint}/${docRef._id}`, { headers });
    return {
      exists: () => true,
      data: () => response.data,
      id: docRef._id,
    };
  } catch (error) {
    return {
      exists: () => false,
      data: () => undefined,
      id: docRef._id,
    };
  }
}

export async function getDocs(collectionRef) {
  try {
    const endpoint = collectionToEndpoint(collectionRef._name);
    const token = localStorage.getItem('sipm_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE}${endpoint}`, { headers });
    const items = Array.isArray(response.data) ? response.data : [response.data];
    return {
      docs: items.map(item => ({
        id: item._id || item.id,
        data: () => item,
        exists: true,
      })),
      empty: items.length === 0,
      size: items.length,
      forEach: (cb) => items.forEach((item, i) => cb({
        id: item._id || item.id,
        data: () => item,
        exists: true,
      })),
    };
  } catch (error) {
    return { docs: [], empty: true, size: 0, forEach: () => {} };
  }
}

export async function setDoc(docRef, data, options) {
  try {
    const endpoint = collectionToEndpoint(docRef._collection);
    const token = localStorage.getItem('sipm_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.put(`${API_BASE}${endpoint}/${docRef._id}`, data, { headers });
  } catch (error) {
    console.error('setDoc error:', error);
  }
}

export async function addDoc(collectionRef, data) {
  try {
    const endpoint = collectionToEndpoint(collectionRef._name);
    const token = localStorage.getItem('sipm_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${API_BASE}${endpoint}`, data, { headers });
    return { id: response.data._id || response.data.id };
  } catch (error) {
    console.error('addDoc error:', error);
    throw error;
  }
}

export async function updateDoc(docRef, data) {
  return setDoc(docRef, data, { merge: true });
}

export async function deleteDoc(docRef) {
  try {
    const endpoint = collectionToEndpoint(docRef._collection);
    const token = localStorage.getItem('sipm_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_BASE}${endpoint}/${docRef._id}`, { headers });
  } catch (error) {
    console.error('deleteDoc error:', error);
  }
}

export function query(collectionRef, ...constraints) {
  return collectionRef;
}

export function where(field, op, value) {
  return { type: 'where', field, op, value };
}

export function orderBy(field, direction) {
  return { type: 'orderBy', field, direction };
}

export function limitFn(n) {
  return { type: 'limit', n };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

// firebase/storage
export function getStorage(app) {
  return { app };
}

export function ref(storage, path) {
  return { path, fullPath: path };
}

export async function getDownloadURL(storageRef) {
  return `http://localhost:3001/uploads/${storageRef.path || storageRef.fullPath || 'default'}`;
}

export async function uploadBytes(storageRef, data) {
  return { ref: storageRef };
}

export async function uploadBytesResumable(storageRef, data) {
  return {
    ref: storageRef,
    on: (event, progress, error, complete) => {
      if (complete) complete();
    },
    snapshot: { ref: storageRef },
  };
}

// Default export (firebase/app compatibility)
const firebaseApp = { initializeApp, getApp };
export default firebaseApp;
