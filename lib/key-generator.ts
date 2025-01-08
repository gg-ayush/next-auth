import crypto from 'crypto';

export function generateKeyPair() {
  const secretKey = crypto.randomBytes(32).toString('hex');
  const publicKey = crypto.randomBytes(24).toString('hex');
  return { secretKey, publicKey };
}

export function hashApiKey(apiKey: string) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

