"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { sendInvitationEmail } from "@/services/mail"
import crypto from "crypto"
import { z } from "zod"

const inviteSchema = z.object({
  email: z.string().email(),
  applicationId: z.string(),
})

export async function inviteUser(data: z.infer<typeof inviteSchema>) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }

    const validatedFields = inviteSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false, error: "Invalid fields" }
    }

    const { email, applicationId } = validatedFields.data

    // Check if user already exists in this application
    const existingUser = await db.user.findFirst({
      where: {
        email,
        ApplicationUser: {
          some: {
            application_id: applicationId,
          },
        },
      },
    })

    if (existingUser) {
      return { success: false, error: "User already exists in this application" }
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setDate(expires.getDate() + 30) // 30 days expiry

    // Create invitation record
    const invitation = await db.invitation.create({
      data: {
        email,
        token,
        expires,
        application_id: applicationId,
      },
    })

    // Send invitation email
    await sendInvitationEmail(email, token, applicationId)

    return { success: true, data: invitation }
  } catch (error) {
    console.error("Failed to send invitation:", error)
    return { success: false, error: "Failed to send invitation" }
  }
}

