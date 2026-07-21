import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton"; // reuse your existing client component

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
  };
}) {
  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      redirect("/login?error=Email and password are required.");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Map technical errors to user-friendly messages
      let message = "Invalid email or password.";
      if (error.message.includes("Email not confirmed")) {
        message = "Please confirm your email address before logging in.";
      } else if (error.message.includes("Invalid login credentials")) {
        message = "Incorrect email or password.";
      }
      // You could add more mappings here

      redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    // Success – redirect to a safe page
    // Change to '/' if you don't have a dashboard yet
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-10">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            Halo<span className="text-indigo-600">.</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold">Welcome Back</h1>
          <p className="mt-3 text-gray-500">
            Login to your Halo Marketplace account.
          </p>
        </div>

        {searchParams.error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <SubmitButton>Login</SubmitButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">Don't have an account?</p>
          <Link
            href="/signup"
            className="mt-2 inline-block font-bold text-indigo-600 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}