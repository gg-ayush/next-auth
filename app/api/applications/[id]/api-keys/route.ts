import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import crypto from 'crypto'
import { ApiResponse } from '../../../types'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'Developer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const application = await db.application.findUnique({
      where: { id: params.id, developer_id: session.user.id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const publicKey = crypto.randomBytes(16).toString('hex')
    const secretKey = crypto.randomBytes(32).toString('hex')
    const hashedSecret = crypto.createHash('sha256').update(secretKey).digest('hex')

    const apiKey = await db.applicationApiKey.create({
      data: {
        application_id: application.id,
        public_key: publicKey,
        hashed_secret: hashedSecret,
      },
    })

    return NextResponse.json({
      data: { publicKey, secretKey },
      status: 201,
    } as ApiResponse, { status: 201 })
  } catch (error) {
    console.error('API key generation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
