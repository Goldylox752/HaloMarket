import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image,
      location,
      slug,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error(error);
    return [];
  }

  return products ?? [];
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price || 0);
}

export default async function HomePage() {
  const products = await getProducts();

  const categories = [
    ["🚗", "Vehicles"],
    ["📱", "Electronics"],
    ["💻", "Computers"],
    ["🏠", "Home"],
    ["👕", "Fashion"],
    ["🎮", "Gaming"],
    ["🛠", "Tools"],
    ["⚽", "Sports"],
    ["🐶", "Pets"],
    ["📚", "Books"],
    ["🎵", "Music"],
    ["💼", "Services"],
  ];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-3xl font-black tracking-tight"
          >
            Halo Market
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">

            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>

            <Link href="/marketplace" className="hover:text-indigo-600">
              Marketplace
            </Link>

            <Link href="/products" className="hover:text-indigo-600">
              Products
            </Link>

            <Link href="/categories" className="hover:text-indigo-600">
              Categories
            </Link>

            <Link href="/sell" className="hover:text-indigo-600">
              Sell
            </Link>

            <Link href="/seller" className="hover:text-indigo-600">
              Seller
            </Link>

            <Link href="/support" className="hover:text-indigo-600">
              Support
            </Link>

          </nav>

          <div className="hidden items-center gap-3 lg:flex">

            <Link
              href="/login"
              className="rounded-xl border px-5 py-2 font-semibold hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
            >
              Sign Up
            </Link>

          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 text-center">

          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
            🇨🇦 Canada's Modern Marketplace
          </span>

          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            Buy, Sell & Discover
            <br />
            Amazing Products
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
            Halo Market connects buyers and sellers across Canada with
            secure accounts, powerful search, messaging, and fast listings.
          </p>

          {/* SEARCH */}

          <div className="mx-auto mt-10 flex max-w-3xl overflow-hidden rounded-2xl border bg-white shadow-lg">

            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              className="w-full px-6 py-5 outline-none"
            />

            <button className="bg-indigo-600 px-8 font-bold text-white hover:bg-indigo-700">
              Search
            </button>

          </div>

          {/* HERO BUTTONS */}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/marketplace"
              className="rounded-2xl bg-black px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              Browse Marketplace
            </Link>

            <Link
              href="/sell"
              className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700"
            >
              Start Selling
            </Link>

            <Link
              href="/support"
              className="rounded-2xl border px-8 py-4 font-bold hover:bg-gray-100"
            >
              ❤️ Support Halo Market
            </Link>

          </div>

          {/* STATS */}

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div>
              <h2 className="text-4xl font-black">10K+</h2>
              <p className="mt-2 text-gray-600">
                Active Listings
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-black">2K+</h2>
              <p className="mt-2 text-gray-600">
                Verified Sellers
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-black">100+</h2>
              <p className="mt-2 text-gray-600">
                Categories
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-black">🇨🇦</h2>
              <p className="mt-2 text-gray-600">
                Canada Wide
              </p>
            </div>

          </div>

        </div>

      </section>
            {/* ================= CATEGORIES ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-black">
                Shop by Category
              </h2>

              <p className="mt-3 text-lg text-gray-600">
                Browse thousands of listings across Canada's most popular categories.
              </p>

            </div>

            <Link
              href="/categories"
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All Categories →
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">

            {categories.map(([icon, name]) => (

              <Link
                key={name}
                href={`/products?category=${name}`}
                className="group rounded-3xl bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="text-6xl transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Browse listings
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FEATURED LISTINGS ================= */}

      <section className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-black">
                Featured Listings
              </h2>

              <p className="mt-2 text-gray-600">
                Recently added products from trusted Canadian sellers.
              </p>

            </div>

            <Link
              href="/products"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
            >
              View All
            </Link>

          </div>

          {products.length === 0 ? (

            <div className="rounded-3xl border bg-gray-50 p-16 text-center">

              <div className="text-7xl">
                📦
              </div>

              <h3 className="mt-6 text-3xl font-black">
                No Listings Yet
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
                Halo Market is ready for sellers.
                Create your first listing and start reaching buyers across Canada.
              </p>

              <Link
                href="/seller/register"
                className="mt-8 inline-block rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700"
              >
                Become a Seller →
              </Link>

            </div>

          ) : (

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                          {products.map((product) => (

                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <Link href={`/product/${product.slug ?? product.id}`}>

                    <div className="relative h-64 bg-gray-100">

                      {product.image ? (

                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width:768px)100vw,400px"
                          className="object-cover"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-7xl">
                          📦
                        </div>

                      )}

                      <button
                        className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                        aria-label="Add to favourites"
                      >
                        ❤️
                      </button>

                    </div>

                  </Link>

                  <div className="space-y-4 p-6">

                    <Link href={`/product/${product.slug ?? product.id}`}>
                      <h3 className="line-clamp-2 text-xl font-bold hover:text-indigo-600">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-3xl font-black text-indigo-600">
                      {formatPrice(product.price)}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">

                      <p>
                        📍 {product.location || "Canada"}
                      </p>

                      <p>
                        ⭐ Verified Seller
                      </p>

                      <p>
                        🚚 Pickup or Shipping
                      </p>

                    </div>

                    <div className="flex gap-3 pt-2">

                      <Link
                        href={`/product/${product.slug ?? product.id}`}
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center font-bold text-white hover:bg-indigo-700"
                      >
                        View Details
                      </Link>

                      <Link
                        href="/messages"
                        className="rounded-xl border px-4 py-3 font-semibold hover:bg-gray-100"
                      >
                        Message
                      </Link>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* ================= WHY HALO MARKET ================= */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16 text-center">

            <h2 className="text-4xl font-black">
              Why Choose Halo Market?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Built for Canadians who want a fast, secure, and modern buying
              and selling experience.
            </p>

          </div>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <div className="text-6xl">🔒</div>

              <h3 className="mt-6 text-2xl font-black">
                Secure Marketplace
              </h3>

              <p className="mt-4 text-gray-600">
                Buy and sell with verified accounts, secure authentication,
                and modern marketplace protections.
              </p>

            </div>

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <div className="text-6xl">💬</div>

              <h3 className="mt-6 text-2xl font-black">
                Instant Messaging
              </h3>

              <p className="mt-4 text-gray-600">
                Contact sellers directly, negotiate prices, and arrange pickup
                or shipping with ease.
              </p>

            </div>

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <div className="text-6xl">🏪</div>

              <h3 className="mt-6 text-2xl font-black">
                Open Your Own Store
              </h3>

              <p className="mt-4 text-gray-600">
                Create a seller profile, publish unlimited listings, manage
                orders, and grow your business.
              </p>

            </div>

          </div>

        </div>

      </section>
            {/* ================= SELLER CTA ================= */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-6xl rounded-3xl bg-black p-12 text-center text-white md:p-20">

          <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
            🚀 Start Selling Today
          </span>

          <h2 className="mt-8 text-4xl font-black md:text-6xl">
            Open Your Halo Store
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300">
            Create your seller account, upload products, manage orders,
            and reach customers across Canada.
          </p>


          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/seller/register"
              className="rounded-2xl bg-indigo-600 px-10 py-4 font-bold hover:bg-indigo-700"
            >
              Become a Seller →
            </Link>


            <Link
              href="/seller/dashboard"
              className="rounded-2xl border border-white px-10 py-4 font-bold hover:bg-white hover:text-black"
            >
              Seller Dashboard
            </Link>

          </div>


        </div>

      </section>



      {/* ================= MARKETPLACE FEATURES ================= */}


      <section className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-4xl font-black">
            Everything You Need
          </h2>


          <div className="mt-12 grid gap-6 md:grid-cols-4">


            <Link
              href="/favourites"
              className="rounded-3xl bg-gray-50 p-8 text-center transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-5xl">
                ❤️
              </div>

              <h3 className="mt-5 font-black text-xl">
                Favourites
              </h3>

              <p className="mt-2 text-gray-600">
                Save products you love.
              </p>

            </Link>



            <Link
              href="/messages"
              className="rounded-3xl bg-gray-50 p-8 text-center transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-5xl">
                💬
              </div>

              <h3 className="mt-5 font-black text-xl">
                Messages
              </h3>

              <p className="mt-2 text-gray-600">
                Chat with buyers and sellers.
              </p>

            </Link>



            <Link
              href="/orders"
              className="rounded-3xl bg-gray-50 p-8 text-center transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-5 font-black text-xl">
                Orders
              </h3>

              <p className="mt-2 text-gray-600">
                Track purchases and sales.
              </p>

            </Link>



            <Link
              href="/dashboard"
              className="rounded-3xl bg-gray-50 p-8 text-center transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-5xl">
                📊
              </div>

              <h3 className="mt-5 font-black text-xl">
                Dashboard
              </h3>

              <p className="mt-2 text-gray-600">
                Manage your account.
              </p>

            </Link>


          </div>

        </div>

      </section>




      {/* ================= SUPPORT ================= */}


      <section className="px-6 py-20">


        <div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 p-12 text-center text-white">


          <h2 className="text-4xl font-black md:text-5xl">
            Help Keep Halo Market Free
          </h2>


          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">

            Your support helps maintain hosting, security,
            development, and new marketplace features.

          </p>



          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">


            <Link
              href="/support"
              className="rounded-2xl bg-white px-8 py-4 font-bold text-indigo-600 hover:bg-gray-100"
            >
              Support Halo Market ❤️
            </Link>



            <Link
              href="/about"
              className="rounded-2xl border border-white px-8 py-4 font-bold hover:bg-white hover:text-indigo-600"
            >
              Learn More
            </Link>


          </div>


        </div>


      </section>
            {/* ================= FOOTER ================= */}

      <footer className="border-t bg-white px-6 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 md:grid-cols-4">


            {/* BRAND */}

            <div>

              <Link
                href="/"
                className="text-3xl font-black"
              >
                Halo Market
              </Link>


              <p className="mt-4 text-gray-600">
                Canada's modern marketplace for buying,
                selling, and discovering products.
              </p>


            </div>



            {/* MARKETPLACE LINKS */}

            <div>

              <h3 className="mb-5 font-black text-lg">
                Marketplace
              </h3>


              <div className="space-y-3 text-gray-600">

                <Link
                  href="/marketplace"
                  className="block hover:text-indigo-600"
                >
                  Marketplace
                </Link>


                <Link
                  href="/products"
                  className="block hover:text-indigo-600"
                >
                  Products
                </Link>


                <Link
                  href="/categories"
                  className="block hover:text-indigo-600"
                >
                  Categories
                </Link>


                <Link
                  href="/sell"
                  className="block hover:text-indigo-600"
                >
                  Sell
                </Link>

              </div>

            </div>




            {/* ACCOUNT */}

            <div>

              <h3 className="mb-5 font-black text-lg">
                Account
              </h3>


              <div className="space-y-3 text-gray-600">


                <Link
                  href="/login"
                  className="block hover:text-indigo-600"
                >
                  Login
                </Link>


                <Link
                  href="/signup"
                  className="block hover:text-indigo-600"
                >
                  Sign Up
                </Link>


                <Link
                  href="/dashboard"
                  className="block hover:text-indigo-600"
                >
                  Dashboard
                </Link>


                <Link
                  href="/favourites"
                  className="block hover:text-indigo-600"
                >
                  Favourites
                </Link>


              </div>


            </div>





            {/* SELLER + SUPPORT */}

            <div>


              <h3 className="mb-5 font-black text-lg">
                Seller
              </h3>


              <div className="space-y-3 text-gray-600">


                <Link
                  href="/seller"
                  className="block hover:text-indigo-600"
                >
                  Seller Center
                </Link>


                <Link
                  href="/seller/register"
                  className="block hover:text-indigo-600"
                >
                  Register as Seller
                </Link>


                <Link
                  href="/orders"
                  className="block hover:text-indigo-600"
                >
                  Orders
                </Link>


                <Link
                  href="/messages"
                  className="block hover:text-indigo-600"
                >
                  Messages
                </Link>


                <Link
                  href="/support"
                  className="block hover:text-indigo-600"
                >
                  Support
                </Link>


              </div>


            </div>


          </div>





          {/* LOWER FOOTER */}

          <div className="mt-14 flex flex-col justify-between gap-6 border-t pt-8 text-sm text-gray-500 md:flex-row">


            <p>
              © 2026 Halo Market. All rights reserved.
            </p>



            <div className="flex flex-wrap gap-6">


              <Link
                href="/about"
                className="hover:text-indigo-600"
              >
                About
              </Link>


              <Link
                href="/contact"
                className="hover:text-indigo-600"
              >
                Contact
              </Link>


              <Link
                href="/privacy"
                className="hover:text-indigo-600"
              >
                Privacy
              </Link>


              <Link
                href="/terms"
                className="hover:text-indigo-600"
              >
                Terms
              </Link>


            </div>


          </div>


        </div>


      </footer>



    </main>

  );

}