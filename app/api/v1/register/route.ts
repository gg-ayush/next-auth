import { db } from "@/lib/db";
import { createUserInApplicationSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedFields = createUserInApplicationSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.errors },
        { status: 400 }
      );
    }

    const { email, username, phone_number, password, application_id } = validatedFields.data;

    const application = await db.application.findUnique({
      where: { id: application_id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { phone_number }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email, username, or phone number already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          phone_number,
          password: hashedPassword,
          role: "User",
          developer_id: application.developer_id,
        },
      });

      await tx.applicationUser.create({
        data: {
          user_id: user.gg_id,
          application_id: application_id,
        },
      });

      return user;
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: result.gg_id,
        email: result.email,
        username: result.username,
        phone_number: result.phone_number,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-API-Secret',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

