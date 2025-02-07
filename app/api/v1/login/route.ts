import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  application_id: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedFields = loginSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.errors },
        { status: 400 }
      );
    }

    const { email, password, application_id } = validatedFields.data;

    const application = await db.application.findUnique({
      where: { id: application_id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const user = await db.user.findFirst({
      where: {
        email,
        ApplicationUser: {
          some: {
            application_id
          }
        }
      }
    });

    if (!user || user.role !== "User") {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Create a session
    createSession(user.gg_id, application_id);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        id: user.gg_id,
        email: user.email,
        username: user.username,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error in user login:', error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

