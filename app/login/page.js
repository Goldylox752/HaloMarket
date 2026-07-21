"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {

  const searchParams = useSearchParams();

  const error = searchParams.get("error");


  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow">

        <h1 className="text-3xl font-black">
          Login
        </h1>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        <Link
          href="/signup"
          className="mt-6 block text-blue-600"
        >
          Create account
        </Link>

      </div>

    </main>
  );
}