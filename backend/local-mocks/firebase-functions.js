/**
 * Local mock for firebase-functions
 */

const storage = {
  object() {
    return {
      onFinalize(handler) {
        // Return a no-op cloud function
        return handler;
      },
    };
  },
};

const https = {
  onRequest(handler) {
    return handler;
  },
};

module.exports = { storage, https };
module.exports.default = { storage, https };
module.exports.__esModule = true;
