import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { sign } from 'jsonwebtoken';
import { ApiResponse, AuthResponse } from '../../types';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await db.user.findFirst({
      where: { email }
    });

    if (!user || !user.password) {
      return Response.json({ 
        error: 'Invalid credentials',
        status: 401
      } as ApiResponse, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return Response.json({ 
        error: 'Invalid credentials',
        status: 401
      } as ApiResponse, { status: 401 });
    }

    const token = sign(
      { 
        userId: user.gg_id, 
        email: user.email, 
        role: user.role
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      data: { 
        user: userWithoutPassword, 
        token 
      },
      status: 200
    } as ApiResponse<AuthResponse>, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ 
      error: 'Internal Server Error',
      status: 500
    } as ApiResponse, { status: 500 });
  }
}

