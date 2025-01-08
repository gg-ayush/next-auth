import { NextRequest, NextResponse } from 'next/server';

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Replace this with your actual allowed origins
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];

  if (origin && allowedOrigins.includes(origin)) {
    const headers = new Headers(request.headers);
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Public-Key, X-Secret-Key');
    headers.set('Access-Control-Allow-Credentials', 'true');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers });
    }

    return new NextResponse(null, { headers });
  }

  return new NextResponse(null, { status: 403 });
}

