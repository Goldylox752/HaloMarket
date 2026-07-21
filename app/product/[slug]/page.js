import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { notFound } from "next/navigation";

async function getProduct(slug: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  // Ensure the user owns this product
  if (data.user_id !== userId) return null;
  return data;
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const product = await getProduct(params.slug, user.id);
  if (!product) notFound();

  async function updateProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = Number(formData.get("price"));
    const location = formData.get("location")?.toString().trim();
    const category = formData.get("category")?.toString();
    const condition = formData.get("condition")?.toString();
    const slug = formData.get("slug")?.toString();

    if (!title || !price || !category) {
      redirect(`/product/edit/${slug}?error=Required fields missing.`);
    }

    const { error } = await supabase
      .from("products")
      .update({
        title,
        description,
        price,
        location,
        category,
        condition,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      redirect(`/product/edit/${slug}?error=Update failed.`);
    }

    redirect(`/product/${slug}`);
  }

  const error = searchParams?.error;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-10 shadow">
          <h1 className="text-3xl font-black">Edit Listing</h1>
          <p className="mt-2 text-gray-600">Update your product details.</p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form action={updateProduct} className="mt-8 space-y-5">
            <input type="hidden" name="slug" value={product.slug} />

            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={product.title}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Price (CAD) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product.price}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                name="location"
                type="text"
                defaultValue={product.location || ""}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                name="category"
                required
                defaultValue={product.category}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select</option>
                <option>Vehicles</option>
                <option>Electronics</option>
                <option>Computers</option>
                <option>Home</option>
                <option>Fashion</option>
                <option>Gaming</option>
                <option>Tools</option>
                <option>Sports</option>
                <option>Services</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Condition</label>
              <select
                name="condition"
                defaultValue={product.condition || ""}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select</option>
                <option>New</option>
                <option>Like New</option>
                <option>Used</option>
                <option>Refurbished</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows="5"
                defaultValue={product.description || ""}
                className="mt-1 w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-4">
              <SubmitButton>Save Changes</SubmitButton>
              <Link
                href={`/product/${product.slug}`}
                className="inline-flex items-center justify-center w-full rounded-xl border border-gray-300 px-6 py-4 font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}