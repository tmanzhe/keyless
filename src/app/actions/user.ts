"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function completeOnboarding(formData: {
  useCase: string;
  storeMemory: boolean;
  microphonePermission: string;
  accessibilityPermission: string;
}) {
  try {
    const { userId } = await auth();
    console.log("Completing onboarding for user:", userId);

    if (!userId) {
      throw new Error("You must be signed in to complete onboarding.");
    }

    const client = await clerkClient();
    const result = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        useCase: formData.useCase,
        storeMemory: formData.storeMemory,
        permissions: {
          microphone: formData.microphonePermission,
          accessibility: formData.accessibilityPermission,
        },
      },
    });
    
    console.log("Metadata updated successfully:", result.publicMetadata);
    
    // Set a temporary cookie to bypass middleware check
    const cookieStore = await cookies();
    cookieStore.set('onboarding-bypass', 'true', {
      maxAge: 10, // 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error;
  }
} 