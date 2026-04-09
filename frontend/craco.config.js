const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'firebase/app': path.resolve(__dirname, 'src/firebase-local.js'),
      'firebase/auth': path.resolve(__dirname, 'src/firebase-local.js'),
      'firebase/firestore': path.resolve(__dirname, 'src/firebase-local.js'),
      'firebase/storage': path.resolve(__dirname, 'src/firebase-local.js'),
      'firebase/analytics': path.resolve(__dirname, 'src/firebase-local.js'),
    },
  },
};
