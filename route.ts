import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RegisterBody = {
  fullName?: string;
  email?: string;
  password?: string;
  storeName?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim();
  const password = body.password;
  const storeName = body.storeName?.trim();

  // Server-side validation mirrors the client, but never trust the client alone.
  if (!fullName || !email || !password || !storeName) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const storeSlug = slugify(storeName);
  if (!storeSlug) {
    return NextResponse.json(
      { message: "Store name must contain at least one letter or number." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // 1. Create the auth user. Supabase handles password hashing, email
  // verification (if enabled in your project settings), and session cookies.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (authError) {
    // Supabase returns a generic message for "email already registered" in
    // some configs — surface what we get, but keep the status code meaningful.
    const status = authError.status ?? 400;
    return NextResponse.json({ message: authError.message }, { status });
  }

  const userId = authData.user?.id;
  if (!userId) {
    return NextResponse.json(
      { message: "Account created, but no user was returned. Try logging in." },
      { status: 500 }
    );
  }

  // 2. Create the seller profile row, linked to the new auth user.
  const { error: profileError } = await supabase.from("sellers").insert({
    id: userId,
    full_name: fullName,
    store_name: storeName,
    store_slug: storeSlug,
  });

  if (profileError) {
    // Handle the case where the store slug is already taken.
    if (profileError.code === "23505") {
      return NextResponse.json(
        { message: "That store name is already taken. Try another." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Account created, but the seller profile failed to save." },
      { status: 500 }
    );
  }

  const needsEmailConfirmation = !authData.session;

  return NextResponse.json(
    {
      message: needsEmailConfirmation
        ? "Account created. Check your email to confirm before logging in."
        : "Account created.",
      needsEmailConfirmation,
    },
    { status: 201 }
  );
}
