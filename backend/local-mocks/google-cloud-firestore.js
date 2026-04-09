/**
 * Local mock for @google-cloud/firestore
 * Delegates to the same lowdb-backed mock used by firebase-admin
 */

// Re-use the firebase-admin mock's Firestore implementation
const admin = require('./firebase-admin');

class Firestore {
  constructor(options) {
    this._db = admin.firestore();
  }

  collection(name) {
    return this._db.collection(name);
  }

  doc(path) {
    return this._db.doc(path);
  }

  settings() {
    // no-op
  }
}

// Re-export FieldValue and Timestamp
Firestore.FieldValue = admin.firestore.FieldValue;
Firestore.Timestamp = admin.firestore.Timestamp;

module.exports = { Firestore };
module.exports.default = { Firestore };
module.exports.__esModule = true;
