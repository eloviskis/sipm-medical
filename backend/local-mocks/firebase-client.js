/**
 * Local mock for firebase client SDK (firebase/app, firebase/firestore, firebase/auth, firebase/storage)
 * Used by customizationRoutes.ts
 */

const admin = require('./firebase-admin');

// firebase/app
function initializeApp(config) {
  return { name: '[DEFAULT]', options: config };
}

function getApp() {
  return { name: '[DEFAULT]' };
}

// firebase/firestore - delegates to firebase-admin mock
const firestoreDb = admin.firestore();

function getFirestore(app) {
  return firestoreDb;
}

function doc(db, ...pathSegments) {
  const fullPath = pathSegments.join('/');
  const parts = fullPath.split('/');
  if (parts.length >= 2) {
    return {
      _collectionName: parts[0],
      _docId: parts[1],
      path: fullPath,
    };
  }
  return { _collectionName: parts[0], path: fullPath };
}

async function getDoc(docRef) {
  const collection = firestoreDb.collection(docRef._collectionName);
  const snap = await collection.doc(docRef._docId).get();
  return {
    exists: () => snap.exists,
    data: () => snap.data(),
    id: snap.id,
  };
}

async function setDoc(docRef, data, options) {
  const collection = firestoreDb.collection(docRef._collectionName);
  await collection.doc(docRef._docId).set(data, options);
}

function collection(db, name) {
  return firestoreDb.collection(name);
}

// firebase/auth
function getAuth(app) {
  return admin.auth();
}

function onAuthStateChanged(auth, callback) {
  // No-op in backend context
  return () => {};
}

// firebase/storage
function getStorage(app) {
  return {
    ref(path) {
      return {
        async getDownloadURL() {
          return `http://localhost:3001/uploads/${path}`;
        },
      };
    },
  };
}

function ref(storage, path) {
  return {
    async getDownloadURL() {
      return `http://localhost:3001/uploads/${path}`;
    },
  };
}

async function getDownloadURL(ref) {
  if (ref && ref.getDownloadURL) return ref.getDownloadURL();
  return 'http://localhost:3001/uploads/default';
}

module.exports = {
  initializeApp,
  getApp,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getAuth,
  onAuthStateChanged,
  getStorage,
  ref,
  getDownloadURL,
};
module.exports.default = { initializeApp };
module.exports.__esModule = true;
