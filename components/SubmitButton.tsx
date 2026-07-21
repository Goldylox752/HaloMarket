"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "black" | "indigo"; // choose your theme
}

export default function SubmitButton({
  children = "Submit",
  className = "",
  variant = "black", // default to match your marketplace
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  // Theme styles
  const themes = {
    black: "bg-black hover:bg-gray-800 text-white",
    indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded-xl py-4 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${themes[variant]} ${className}`}
    >
      {pending ? "Please wait..." : children}
    </button>
  );
}