/**
 * Local development entry point.
 * Sets up module aliases to replace Firebase/Google Cloud modules with local mocks,
 * then starts the server.
 */

// Load env variables first
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Set required env vars if missing
process.env.PORT = process.env.PORT || '3001';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'http://localhost:3001';
process.env.STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'local-bucket';
process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'sipm-local';

// Register module aliases BEFORE any other imports
const moduleAlias = require('module-alias');

const mocksDir = path.join(__dirname, 'local-mocks');

moduleAlias.addAliases({
  'firebase-admin': path.join(mocksDir, 'firebase-admin'),
  '@google-cloud/secret-manager': path.join(mocksDir, 'google-cloud-secret-manager'),
  '@google-cloud/logging': path.join(mocksDir, 'google-cloud-logging'),
  '@google-cloud/storage': path.join(mocksDir, 'google-cloud-storage'),
  '@google-cloud/firestore': path.join(mocksDir, 'google-cloud-firestore'),
  'firebase-functions': path.join(mocksDir, 'firebase-functions'),
  'firebase/app': path.join(mocksDir, 'firebase-client'),
  'firebase/firestore': path.join(mocksDir, 'firebase-client'),
  'firebase/auth': path.join(mocksDir, 'firebase-client'),
  'firebase/storage': path.join(mocksDir, 'firebase-client'),
  'firebase': path.join(mocksDir, 'firebase-client'),
});

console.log('=== SIPM Backend - Local Development Mode ===');
console.log(`Module aliases registered for local mocks`);
console.log(`Port: ${process.env.PORT}`);
console.log('');

// Now load the compiled server
require('./dist/server');
