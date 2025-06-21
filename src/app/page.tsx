import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <header className="flex justify-end p-4">
        <UserButton />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Home Page</h1>
      </main>
    </div>
  );
}
