"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeOnboarding() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to complete onboarding.");
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    revalidatePath("/");
    redirect("/dashboard");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Could not complete onboarding.");
  }
} 