import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../types';

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
    } = await req.json();

    // Check for existing user
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
          { phone_number },
        ]
      },
    });

    if (existingUser) {
      return Response.json({ 
        error: 'User already exists',
        status: 400
      } as ApiResponse, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.user.create({
      data: {
        username,
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        role: 'User'
      }
    });
    
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json({
      data: userWithoutPassword,
      status: 201
    } as ApiResponse, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ 
      error: 'Internal Server Error',
      status: 500
    } as ApiResponse, { status: 500 });
  }
}

