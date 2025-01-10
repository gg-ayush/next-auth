import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { ApiResponse } from '../../types'
import crypto from 'crypto'
import { handleCORS } from '@/lib/cors'

async function verifyApiKey(publicKey: string, secretKey: string) {
  const apiKey = await db.applicationApiKey.findUnique({
    where: { 
      public_key: publicKey 
    },
    include: {
      application: true
    }
  })

  if (!apiKey) return null

  const hashedSecret = crypto.createHash('sha256').update(secretKey).digest('hex')
  if (hashedSecret !== apiKey.hashed_secret) return null

  return apiKey.application
}

export async function POST(req: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(req)
  if (corsResponse) return corsResponse

  try {
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      publicKey,
      secretKey
    } = await req.json()

    // Verify API key and get associated application
    const application = await verifyApiKey(publicKey, secretKey)
    if (!application) {
      return NextResponse.json({ 
        error: 'Invalid API key',
        status: 401
      } as ApiResponse, { status: 401 })
    }

    // Check for existing user within the specific application
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
          { phone_number },
        ],
        ApplicationUser: {
          some: {
            application_id: application.id
          }
        }
      },
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists in this application',
        status: 400
      } as ApiResponse, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    // Create user with proper ApplicationUser relation
    const newUser = await db.user.create({
      data: {
        username,
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        role: 'User',
        ApplicationUser: {
          create: [
            {
              application: {
                connect: {
                  id: application.id
                }
              }
            }
          ]
        }
      }
    })
    
    const { password: _, ...userWithoutPassword } = newUser

    const response = NextResponse.json({
      data: userWithoutPassword,
      status: 201
    } as ApiResponse, { status: 201 })

    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', req.headers.get('origin') ?? '')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response

  } catch (error) {
    console.error('Registration error:', error)
    const errorResponse = NextResponse.json({ 
      error: 'Internal Server Error',
      status: 500
    } as ApiResponse, { status: 500 })

    // Add CORS headers to error response
    errorResponse.headers.set('Access-Control-Allow-Origin', req.headers.get('origin') ?? '')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return errorResponse
  }
}

