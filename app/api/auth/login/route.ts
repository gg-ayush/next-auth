import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { corsMiddleware } from '@/lib/cors';
import { verifyApiKey } from '@/lib/api-key-verification';
import { sign } from 'jsonwebtoken';
import { ApiResponse, AuthResponse } from '../../types';

export async function POST(req: NextRequest) {
  const corsResponse = await corsMiddleware(req);
  if (corsResponse) return corsResponse;

  const apiKeyVerification = await verifyApiKey(req);
  if ('error' in apiKeyVerification) {
    return Response.json(
      { error: apiKeyVerification.error, status: apiKeyVerification.status } as ApiResponse,
      { status: apiKeyVerification.status }
    );
  }

  try {
    const { email, password } = await req.json();

    const user = await db.user.findFirst({
      where: { 
        email,
        ApplicationUser: {
          some: {
            application_id: apiKeyVerification.applicationId
          }
        }
      },
      include: {
        ApplicationUser: {
          where: {
            application_id: apiKeyVerification.applicationId
          }
        }
      }
    });

    if (!user || !user.password) {
      return Response.json({ 
        error: 'Invalid credentials for this application',
        status: 401,
        applicationId: apiKeyVerification.applicationId,
        developerId: apiKeyVerification.developerId
      } as ApiResponse, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return Response.json({ 
        error: 'Invalid credentials for this application',
        status: 401,
        applicationId: apiKeyVerification.applicationId,
        developerId: apiKeyVerification.developerId
      } as ApiResponse, { status: 401 });
    }

    const token = sign(
      { 
        userId: user.gg_id, 
        email: user.email, 
        role: user.role,
        applicationId: apiKeyVerification.applicationId
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      data: { 
        user: {
          ...userWithoutPassword,
          applicationId: apiKeyVerification.applicationId
        }, 
        token 
      },
      status: 200,
      applicationId: apiKeyVerification.applicationId,
      developerId: apiKeyVerification.developerId
    } as ApiResponse<AuthResponse>, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ 
      error: 'Internal Server Error',
      status: 500,
      applicationId: apiKeyVerification.applicationId,
      developerId: apiKeyVerification.developerId
    } as ApiResponse, { status: 500 });
  }
}

