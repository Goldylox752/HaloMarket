import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default function SignupPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
    message?: string;
  };
}) {
  async function signup(formData: FormData) {
    "use server";

    const fullName = formData.get("fullName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      redirect("/signup?error=All fields are required.");
    }

    if (password.length < 6) {
      redirect("/signup?error=Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      redirect("/signup?error=Passwords do not match.");
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      let message = "Could not create account. Please try again.";
      if (error.message.includes("User already registered")) {
        message = "An account with this email already exists.";
      }
      redirect(`/signup?error=${encodeURIComponent(message)}`);
    }

    // After successful signup, redirect to login with success message
    // (Assumes email confirmation is enabled in Supabase)
    redirect("/login?message=Account created! Please check your email to confirm.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-10">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            Halo<span className="text-indigo-600">.</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold">Create Account</h1>
          <p className="mt-3 text-gray-500">
            Join Halo Marketplace and start selling.
          </p>
        </div>

        {searchParams.error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {searchParams.error}
          </div>
        )}

        {searchParams.message && (
          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-600">
            {searchParams.message}
          </div>
        )}

        <form action={signup} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="John Doe"
              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Min 6 characters"
              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <SubmitButton>Create Account</SubmitButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">Already have an account?</p>
          <Link
            href="/login"
            className="mt-2 inline-block font-bold text-indigo-600 hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}