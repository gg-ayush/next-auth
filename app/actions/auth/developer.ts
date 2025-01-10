"use server";

import { response, ResponseSuccessWithSecretKey, ResponseError } from "@/lib/utils";
import { regenerateApiKey } from "@/services/apiKey";
import { auth } from "@/auth";
import {
  createApplicationSchema,
  createUserInApplicationSchema,
} from "@/schemas";
import {
  createApplication,
  getApplicationById,
} from "@/services/application";

import { createUserForApplication } from "@/services/user";
import { z } from "zod";
import { ApplicationApiKey } from "@prisma/client";

type CreateUserInApplicationInput = z.infer<typeof createUserInApplicationSchema>;

export const createNewApplication = async (
  payload: z.infer<typeof createApplicationSchema>
) => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "Developer") {
      return response({
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can create applications.",
        },
      });
    }

    const validatedFields = createApplicationSchema.safeParse(payload);
    if (!validatedFields.success) {
      return response({
        success: false,
        error: {
          code: 422,
          message: "Invalid fields.",
        },
      });
    }
    
    const application = await createApplication(
      validatedFields.data.name,
      validatedFields.data.description || null,
      session.user.gg_id
    );

    if (!application) {
      return response({
        success: false,
        error: {
          code: 500,
          message: "Failed to create application.",
        },
      });
    }

    return response({
      success: true,
      code: 201,
      message: "Application created successfully.",
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

export const createUserInApplication = async (
  payload: CreateUserInApplicationInput
) => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "Developer") {
      return response({
        success: false,
        error: {
          code: 403,
          message: "Unauthorized. Only developers can create users in applications.",
        },
      });
    }

    const validatedFields = createUserInApplicationSchema.safeParse(payload);
    if (!validatedFields.success) {
      return response({
        success: false,
        error: {
          code: 422,
          message: "Invalid fields.",
        },
      });
    }

    // Verify the application exists and belongs to the developer
    const application = await getApplicationById(validatedFields.data.application_id);
    if (!application || application.developer_id !== session.user.gg_id) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "Application not found or doesn't belong to you.",
        },
      });
    }

    const user = await createUserForApplication(
      {
        ...validatedFields.data,
        role: "User",
      },
      application.id
    );

    if (!user) {
      return response({
        success: false,
        error: {
          code: 500,
          message: "Failed to create user in application.",
        },
      });
    }

    return response({
      success: true,
      code: 201,
      message: "User created and assigned to application successfully.",
      data: user,
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


