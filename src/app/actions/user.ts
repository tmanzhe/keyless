"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeOnboarding() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to complete onboarding.");
  }

  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Could not complete onboarding.");
  }
} 