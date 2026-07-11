import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// app/product/[id]/page.tsx
// Public product detail page. Reads a single row from `products` by id.

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, description, price, location, image_url, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found | Halo Marketplace" };
  return {
    title: `${product.title} | Halo Marketplace`,
    description: product.description ?? `${product.title} — ${formatPrice(product.price)} on Halo Marketplace.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          ← Back to browsing
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>

            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>

            {product.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <span aria-hidden="true">📍</span>
                {product.location}
              </p>
            )}

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {product.description || "No description provided."}
              </p>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:px-8"
            >
              Contact seller
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
