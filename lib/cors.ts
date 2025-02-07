import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000']

export function cors(req: NextRequest) {
  const origin = req.headers.get('origin') ?? ''
  
  // Check if the origin is allowed
  if (!allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

// Helper method to handle CORS preflight requests
export function handleCORS(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return cors(req)
  }
  return null
}
