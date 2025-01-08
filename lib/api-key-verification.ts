import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashApiKey } from '@/lib/key-generator';
import { ApiResponse } from '@/app/api/types';

export async function verifyApiKey(req: NextRequest): Promise<
  | { applicationId: string; developerId: string; status: number; application: any }
  | ApiResponse
> {
  const publicKey = req.headers.get('X-Public-Key');
  const secretKey = req.headers.get('X-Secret-Key');

  if (!publicKey || !secretKey) {
    return { error: 'Missing API key', status: 401 };
  }

  const apiKey = await db.applicationApiKey.findUnique({
    where: { public_key: publicKey },
    include: { application: true },
  });

  if (!apiKey || apiKey.hashed_secret !== hashApiKey(secretKey)) {
    return { error: 'Invalid API key', status: 401 };
  }

  return {
    status: 200,
    applicationId: apiKey.application_id,
    developerId: apiKey.application.developer_id,
    application: apiKey.application,
  };
}

