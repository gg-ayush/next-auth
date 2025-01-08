import { verifyApiKey } from '@/lib/api-key-verification';
import { hashPassword } from '@/lib/auth';
import { corsMiddleware } from '@/lib/cors';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../types';

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
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
    } = await req.json();

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
            application_id: apiKeyVerification.applicationId
          }
        }
      },
    });

    if (existingUser) {
      return Response.json({ 
        error: 'User already exists in this application',
        status: 400,
        applicationId: apiKeyVerification.applicationId,
        developerId: apiKeyVerification.developerId
      } as ApiResponse, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

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
        developer_id: apiKeyVerification.developerId,
        ApplicationUser: {
          create: [
            {
              application: {
                connect: {
                  id: apiKeyVerification.applicationId
                }
              }
            }
          ]
        }
      },
      include: {
        ApplicationUser: true
      }
    });
    
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json({
      data: userWithoutPassword,
      status: 201,
      applicationId: apiKeyVerification.applicationId,
      developerId: apiKeyVerification.developerId
    } as ApiResponse, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ 
      error: 'Internal Server Error',
      status: 500,
      applicationId: apiKeyVerification.applicationId,
      developerId: apiKeyVerification.developerId
    } as ApiResponse, { status: 500 });
  }
}

