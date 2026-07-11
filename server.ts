import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use this client in Route Handlers, Server Components, and Server Actions.
// It reads/writes the auth cookie so the user's session persists across requests.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component in some cases (e.g. during
            // a render pass) where cookies can't be mutated. Safe to ignore if you
            // have middleware refreshing sessions — see supabase docs on SSR.
          }
        },
      },
    }
  );
}
