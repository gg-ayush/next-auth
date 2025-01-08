"use server";

import { auth } from "@/auth";
import { getUserById } from "@/services/user";

export async function getCurrentUser() {
  const session = await auth();
  if (!session || !session.user || !session.user.gg_id) {
    return null;
  }

  try {
    const user = await getUserById(session.user.gg_id);
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
