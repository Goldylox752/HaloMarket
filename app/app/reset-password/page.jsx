import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [session, setSession] = useState(null);

  // Listen for the password recovery event – THIS IS THE KEY
  useEffect(() => {
    // First, check if we already have a session (e.g., after page reload)
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setLoading(false);
        return;
      }

      // No session yet – wait for the auth state change
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
            setSession(session);
            setLoading(false);
          } else if (event === "SIGNED_OUT") {
            // Something went wrong
            setError("Invalid or expired reset link.");
            setLoading(false);
          }
        }
      );

      // Cleanup
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    checkSession();
  }, [supabase]);

  // Update password
  async function updatePassword(formData) {
    const newPassword = formData.get("password")?.toString();
    const confirm = formData.get("confirmPassword")?.toString();

    if (!newPassword || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error("Update error:", error);
      setError("Could not update password. Please try again.");
      return;
    }

    // Sign out to clear the recovery session
    await supabase.auth.signOut();
    router.push("/login?message=Password updated successfully. Please log in.");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <p className="text-gray-500">Validating your link...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Link</h1>
          <p className="mt-4 text-gray-600">
            The reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="mt-6 inline-block text-indigo-600 font-bold">
            Request a new one
          </Link>
        </div>
      </main>
    );
  }