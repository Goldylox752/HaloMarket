import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getProduct(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles (  -- assuming you have a profiles table with user info
        id,
        full_name,
        avatar_url,
        location
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }

  // Build full image URL (same as before)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "product-images";
  data.image = data.image
    ? `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.image}`
    : null;

  return data;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price || 0);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-indigo-600 font-bold">
          ← Back to listings
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-80 md:h-96 bg-gray-100 rounded-3xl overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-black">{product.title}</h1>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {formatPrice(product.price)}
            </p>
            <p className="mt-2 text-gray-500">
              📍 {product.location || "Canada"} · {product.category}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold">
                  {product.profiles?.full_name || "Anonymous Seller"}
                </p>
                <p className="text-sm text-gray-500">
                  Member since ... {/* you could add a joined_at field */}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="font-bold text-lg">Description</h2>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="rounded-xl bg-black px-8 py-4 font-bold text-white hover:bg-gray-800 transition">
                💬 Message Seller
              </button>
              <button className="rounded-xl border border-gray-300 px-8 py-4 font-bold hover:bg-gray-100 transition">
                ❤️ Save
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Listed on {new Date(product.created_at).toLocaleDateString("en-CA")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}