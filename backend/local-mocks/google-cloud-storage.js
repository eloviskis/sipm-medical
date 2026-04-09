/**
 * Local mock for @google-cloud/storage
 */

const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

class File {
  constructor(bucket, filePath) {
    this.bucket = bucket;
    this.name = filePath;
    this._localPath = path.join(UPLOADS_DIR, filePath);
  }

  async getSignedUrl(config) {
    return [`http://localhost:3001/uploads/${this.name}`];
  }

  async save(data) {
    const dir = path.dirname(this._localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this._localPath, data);
  }

  async delete() {
    if (fs.existsSync(this._localPath)) fs.unlinkSync(this._localPath);
  }

  async exists() {
    return [fs.existsSync(this._localPath)];
  }

  async download() {
    if (!fs.existsSync(this._localPath)) throw new Error('File not found');
    return [fs.readFileSync(this._localPath)];
  }

  createWriteStream(options) {
    const dir = path.dirname(this._localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return fs.createWriteStream(this._localPath);
  }

  createReadStream() {
    return fs.createReadStream(this._localPath);
  }
}

class Bucket {
  constructor(name) {
    this.name = name || 'local-bucket';
  }

  file(filePath) {
    return new File(this, filePath);
  }

  async upload(localPath, options) {
    const dest = options?.destination || path.basename(localPath);
    const f = new File(this, dest);
    const data = fs.readFileSync(localPath);
    await f.save(data);
    return [f];
  }

  async getFiles(options) {
    const prefix = options?.prefix || '';
    const baseDir = path.join(UPLOADS_DIR, prefix);
    if (!fs.existsSync(baseDir)) return [[]];
    
    const files = [];
    const walk = (dir, relative) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = path.join(relative, entry.name);
        if (entry.isDirectory()) {
          walk(path.join(dir, entry.name), rel);
        } else {
          files.push(new File(this, rel));
        }
      }
    };
    walk(baseDir, prefix);
    return [files];
  }
}

class Storage {
  constructor(options) {
    this._projectId = options?.projectId || 'local';
  }

  bucket(name) {
    return new Bucket(name);
  }
}

module.exports = { Storage };
module.exports.default = { Storage };
module.exports.__esModule = true;
