import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>

      <Hero />

      <CategoryGrid />

      <FeaturedSection />

      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-bold">
            Start Selling on Halo
          </h2>

          <p className="mt-5 text-xl text-gray-300">
            Reach customers across Canada with your own
            online storefront.
          </p>

          <button className="mt-8 bg-white text-black px-8 py-4 rounded-xl font-bold">
            Create Seller Account
          </button>

        </div>
      </section>

      <Footer />

    </main>
  );
}
