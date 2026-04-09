/**
 * Local mock for @google-cloud/logging
 */

class Log {
  constructor(name) {
    this.name = name;
  }
  entry(metadata, data) {
    return { metadata, data };
  }
  async write(entry) {
    // Just log to console instead of Google Cloud
    const level = (entry.metadata?.severity || 'INFO').toLowerCase();
    const msg = entry.data?.message || JSON.stringify(entry.data);
    console[level === 'error' ? 'error' : 'log'](`[${this.name}] ${msg}`);
  }
}

class Logging {
  log(name) {
    return new Log(name);
  }
}

module.exports = { Logging };
module.exports.default = { Logging };
module.exports.__esModule = true;
