import Link from "next/link";

// app/page.tsx
export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-center min-h-screen p-8">
      <div>
        <h1 className="text-6xl font-ultralight mb-2">Lil Farm Hill</h1>
        <p className="text-xl font-sans mb-4">Upper Ojai, California</p>
      </div>
      <Link href="/legal/terms-of-service" passHref>
      Terms of Service
      </Link>
      <Link href="/legal/privacy-policy" passHref>
      Privacy Policy
      </Link>

    </main>
  );
}
