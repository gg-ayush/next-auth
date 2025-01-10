import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse } from '../../types'

async function verifyApiKey(publicKey: string, secretKey: string) {
  const apiKey = await db.applicationApiKey.findUnique({
    where: { public_key: publicKey },
    include: { application: true },
  })

  if (!apiKey) return null

  const hashedSecret = crypto.createHash('sha256').update(secretKey).digest('hex')
  if (hashedSecret !== apiKey.hashed_secret) return null

  return apiKey.application
}

export async function POST(req: NextRequest) {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders })
  }

  try {
    const { email, password, publicKey, secretKey } = await req.json()

    const application = await verifyApiKey(publicKey, secretKey)
    if (!application) {
      return NextResponse.json({ 
        error: 'Invalid API key',
        status: 401
      } as ApiResponse, { status: 401, headers: corsHeaders })
    }

    const user = await db.user.findFirst({
      where: { 
        email,
        ApplicationUser: {
          some: {
            application_id: application.id
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found', status: 404 } as ApiResponse, { status: 404, headers: corsHeaders })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Invalid credentials', status: 401 } as ApiResponse, { status: 401, headers: corsHeaders })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials', status: 401 } as ApiResponse, { status: 401, headers: corsHeaders })
    }

    const token = jwt.sign({ id: user.gg_id, email: user.email }, process.env.JWT_SECRET as string)

    return NextResponse.json({ token, user, status: 200 } as ApiResponse, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong', status: 500 } as ApiResponse, { status: 500, headers: corsHeaders })
  }
}
