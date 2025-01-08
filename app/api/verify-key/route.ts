import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashApiKey } from '@/lib/key-generator';

export async function POST(req: NextRequest) {
  const publicKey = req.headers.get('X-Public-Key');
  const secretKey = req.headers.get('X-Secret-Key');

  if (!publicKey || !secretKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  try {
    const apiKey = await db.applicationApiKey.findUnique({
      where: { public_key: publicKey },
      include: { application: { include: { developer: true } } },
    });

    if (!apiKey || apiKey.hashed_secret !== hashApiKey(secretKey)) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Update last used timestamp
    await db.applicationApiKey.update({
      where: { id: apiKey.id },
      data: { last_used: new Date() },
    });

    return NextResponse.json({
      applicationId: apiKey.application_id,
      developerId: apiKey.application.developer_id,
      developerRole: apiKey.application.developer.role,
    });
  } catch (error) {
    console.error('API Key verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
