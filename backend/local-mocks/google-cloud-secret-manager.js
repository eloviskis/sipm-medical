/**
 * Local mock for @google-cloud/secret-manager
 */

class SecretManagerServiceClient {
  async accessSecretVersion({ name }) {
    // Extract secret name from path like "projects/sipm-stage/secrets/SECRET_NAME/versions/latest"
    const parts = name.split('/');
    const secretName = parts[3]; // secrets/<name>
    const value = process.env[secretName] || 'local-mock-secret';
    
    return [{
      payload: {
        data: Buffer.from(value),
      },
    }];
  }
}

module.exports = { SecretManagerServiceClient };
module.exports.default = { SecretManagerServiceClient };
module.exports.__esModule = true;
