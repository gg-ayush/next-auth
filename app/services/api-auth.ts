import { db } from '@/lib/db';
import crypto from 'crypto';
import { Application, ApplicationApiKey } from '@prisma/client';

export async function verifyApiKeyAndGetApplication(publicKey: string, secretKey: string): Promise<Application> {
  const apiKey = await db.applicationApiKey.findUnique({
    where: { public_key: publicKey },
    include: { application: true },
  });

  if (!apiKey) {
    throw new Error('Invalid API key');
  }

  const hashedSecret = crypto.createHash('sha256').update(secretKey).digest('hex');

  if (hashedSecret !== apiKey.hashed_secret) {
    throw new Error('Invalid API secret');
  }

  // Update last_used timestamp
  await db.applicationApiKey.update({
    where: { id: apiKey.id },
    data: { last_used: new Date() },
  });

  return apiKey.application;
}

