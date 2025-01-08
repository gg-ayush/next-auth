import { db } from "@/lib/db";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";

export const createUserForDeveloper = async (
  userData: Omit<Prisma.UserCreateInput, "developer">,
  developer_id: string
): Promise<User | null> => {
  try {
    let hashedPassword: string | undefined;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    const user = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        developer_id,
        role: "User", // Ensure the role is set to User
      },
    });
    return user;
  } catch (error) {
    console.error("Error in createUserForDeveloper:", error);
    return null;
  }
};

export const addUserToApplication = async (
  user_id: string,
  application_id: string
) => {
  try {
    const applicationUser = await db.applicationUser.create({
      data: {
        user_id,
        application_id,
      },
    });
    return applicationUser;
  } catch (error) {
    console.error("Error in addUserToApplication:", error);
    return null;
  }
};

