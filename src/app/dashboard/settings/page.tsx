import { UserButton } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="px-8 py-4">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account and preferences.
      </p>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
            <span className="text-sm text-muted-foreground">Manage your Clerk account</span>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
          <p className="text-muted-foreground">More settings coming soon...</p>
        </div>
      </div>
    </div>
  );
} 