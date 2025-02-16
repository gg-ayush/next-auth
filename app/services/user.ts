import { db } from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { Prisma, UserRole } from "@prisma/client";

interface CreateUserData {
  username: string;
  email?: string;
  password: string;
  phone_number?: string;
  role: 'User' | 'Developer';
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return null;
  }
};

export const getUserByPhone = async (phone_number: string) => {
  try {
    const user = await db.user.findUnique({
      where: { phone_number },
    });
    if (!user) {
      console.log(`User not found with phone number: ${phone_number}`);
    }
    return user;
  } catch (error) {
    console.error("Error in getUserByPhoneNumber:", error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error("Error in getUserByUsername:", error);
    return null;
  }
};

export const getUserById = async (gg_id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { gg_id },
    });
    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
};

export const createUser = async (userData: Prisma.UserCreateInput) => {
  try {
    return await db.user.create({
      data: userData,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return null;
  }
};

export const updateUserById = async (
  gg_id: string,
  userData: Prisma.UserUpdateInput
) => {
  try {
    return await db.user.update({
      where: { gg_id },
      data: userData,
    });
  } catch (error) {
    console.error("Error in updateUserById:", error);
    return null;
  }
};

export const getUsersByDeveloperId = async (developer_id: string) => {
  try {
    const users = await db.user.findMany({
      where: { developer_id },
    });
    return users;
  } catch (error) {
    console.error("Error in getUsersByDeveloperId:", error);
    return null;
  }
};

export const updateUserRole = async (gg_id: string, role: UserRole) => {
  try {
    return await db.user.update({
      where: { gg_id },
      data: { role },
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return null;
  }
};

export const createUserForApplication = async (
  userData: CreateUserData, 
  applicationId: string
) => {
  const hashedPassword = await hashPassword(userData.password);

  return db.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      phone_number: userData.phone_number,
      role: userData.role,
      ApplicationUser: {
        create: {
          application_id: applicationId,
        },
      },
    },
    include: {
      ApplicationUser: true,
    },
  });
};

export async function getApplicationUsers(applicationId: string) {
  try {
    console.log(`Fetching users for application: ${applicationId}`)
    const users = await db.applicationUser.findMany({
      where: {
        application_id: applicationId,
        user: {
          role: UserRole.User,
        },
      },
      include: {
        user: {
          select: {
            gg_id: true,
            email: true,
            username: true,
            phone_number: true,
            created_at: true,
          },
        },
      },
    })

    console.log(`Found ${users.length} users for application ${applicationId}`)

    const formattedUsers = users.map((au) => ({
      id: au.user.gg_id,
      email: au.user.email,
      username: au.user.username,
      phone_number: au.user.phone_number,
      joined: au.user.created_at.toISOString(),
      lastSignedIn: null, // You might want to add this field to your schema if needed
    }))

    return { success: true, data: formattedUsers }
  } catch (error) {
    console.error("Error fetching application users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}