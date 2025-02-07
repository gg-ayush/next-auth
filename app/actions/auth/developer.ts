"use server";

import { response, ResponseSuccessWithSecretKey, ResponseError, ResponseSuccess } from "@/lib/utils";
import { regenerateApiKey } from "@/app/services/api-keys";
import { auth } from "@/auth";
import {
  createApplicationSchema,
  createUserInApplicationSchema,
} from "@/schemas";
import {
  createApplication,
  getApplicationById,
} from "@/services/application";
import bcrypt from "bcryptjs";
import { createUserForApplication } from "@/services/user";
import { z } from "zod";
import { ApplicationApiKey } from "@prisma/client";
import { db } from "@/lib/db";
import { generateKeyPair, hashApiKey } from "@/lib/key-generator";

type CreateUserInApplicationInput = z.infer<typeof createUserInApplicationSchema>;
type Application = {
  id: string
  name: string
  description: string | null
}
type User = {
  id: string
  email: string
  username: string
  phone_number: string
}

export async function createNewApplication(
  payload: z.infer<typeof createApplicationSchema>
): Promise<ResponseSuccessWithSecretKey<Application> | ResponseError> {
  try {
    const session = await auth()
    if (!session || !session.user || session.user.role !== "Developer") {
      return {
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can create applications.",
        },
      }
    }

    const validatedFields = createApplicationSchema.safeParse(payload)
    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          code: 422,
          message: "Invalid fields.",
        },
      }
    }
    
    const { secretKey, publicKey } = generateKeyPair();
    const hashedSecret = hashApiKey(secretKey);

    const result = await db.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          name: validatedFields.data.name,
          description: validatedFields.data.description,
          developer: {
            connect: { gg_id: session.user.gg_id }
          }
        }
      });

      const apiKey = await tx.applicationApiKey.create({
        data: {
          application_id: application.id,
          public_key: publicKey,
          hashed_secret: hashedSecret,
        }
      });

      return { application, apiKey };
    });

    if (!result.application || !result.apiKey) {
      return {
        success: false,
        error: {
          code: 500,
          message: "Failed to create application or generate API key.",
        },
      }
    }

    return {
      success: true,
      code: 201,
      message: "Application created successfully with API key.",
      data: result.application,
      secretKey: secretKey, // This is the only time we'll send the secret key
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: {
        code: 500,
        message: "An unexpected error occurred.",
      },
    }
  }
}

export async function createUserInApplication(
  payload: z.infer<typeof createUserInApplicationSchema>
): Promise<ResponseSuccess<User> | ResponseError> {
  try {
    const session = await auth()
    
    console.log('Session:', session)
    console.log('Payload:', { ...payload, password: '******' })

    if (!session || !session.user || session.user.role !== "Developer") {
      return {
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can create users in applications.",
        },
      }
    }

    const validatedFields = createUserInApplicationSchema.safeParse(payload)
    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          code: 422,
          message: "Invalid fields.",
        },
      }
    }

    console.log('Looking up application:', {
      id: validatedFields.data.application_id,
      developer_id: session.user.gg_id
    })

    const application = await db.application.findUnique({
      where: {
        id: validatedFields.data.application_id,
      },
    })

    if (!application) {
      return {
        success: false,
        error: {
          code: 404,
          message: "Application not found.",
        },
      }
    }

    if (application.developer_id !== session.user.gg_id) {
      return {
        success: false,
        error: {
          code: 403,
          message: "Application doesn't belong to you.",
        },
      }
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10)

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedFields.data.email,
          username: validatedFields.data.username,
          phone_number: validatedFields.data.phone_number,
          password: hashedPassword,
          role: "User",
          developer_id: session.user.gg_id,
        },
      })

      await tx.applicationUser.create({
        data: {
          user_id: user.gg_id,
          application_id: application.id,
        },
      })

      return user
    })

    return {
      success: true,
      code: 201,
      message: "User created and assigned to application successfully.",
      data: {
        id: result.gg_id,
        email: result.email!,
        username: result.username!,
        phone_number: result.phone_number!
      },
    }
  } catch (error) {
    console.error('Detailed error:', error)

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: {
            code: 400,
            message: "A user with this email or username already exists.",
          },
        }
      }
    }

    return {
      success: false,
      error: {
        code: 500,
        message: "An unexpected error occurred.",
      },
    }
  }
}

// Get Application Function
export const getApplication = async (applicationId: string) => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "Developer") {
      return response({
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can access applications.",
        },
      });
    }

    const application = await getApplicationById(applicationId);
    if (!application || application.developer_id !== session.user.gg_id) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "Application not found or doesn't belong to you.",
        },
      });
    }

    return response({
      success: true,
      code: 200,
      data: application,
    });
  } catch (error) {
    console.error(error);
    return response({
      success: false,
      error: {
        code: 500,
        message: "An unexpected error occurred.",
      },
    });
  }
};

export const regenerateApplicationApiKey = async (
  applicationId: string
): Promise<ResponseError | ResponseSuccessWithSecretKey<ApplicationApiKey>> => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "Developer") {
      return response({
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can regenerate API keys.",
        },
      });
    }

    const application = await getApplicationById(applicationId);
    if (!application || application.developer_id !== session.user.gg_id) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "Application not found or doesn't belong to you.",
        },
      });
    }

    const newApiKey = await regenerateApiKey(applicationId);

    if (!newApiKey) {
      return response({
        success: false,
        error: {
          code: 500,
          message: "Failed to regenerate API key.",
        },
      });
    }

    const { secret_key, ...publicApiKeyInfo } = newApiKey;

    return response({
      success: true,
      code: 200,
      message: "API key regenerated successfully.",
      data: publicApiKeyInfo,
      secretKey: secret_key,
    });
  } catch (error) {
    console.error(error);
    return response({
      success: false,
      error: {
        code: 500,
        message: "An unexpected error occurred.",
      },
    });
  }
};

export async function getApplications() {
  try {
    const session = await auth()
    if (!session?.user?.gg_id) {
      return { success: false, error: "Unauthorized" }
    }

    const applications = await db.application.findMany({
      where: {
        developer_id: session.user.gg_id
      },
      select: {
        id: true,
        name: true,
        description: true,
      }
    })

    return { success: true, data: applications }
  } catch (error) {
    console.error('Error fetching applications:', error)
    return { success: false, error: "Failed to fetch applications" }
  }
}
