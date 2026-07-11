import { Suspense } from "react";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import SellerCTA from "@/components/SellerCTA";
import MarketplaceStats from "@/components/MarketplaceStats";

export const metadata: Metadata = {
  title: "Marketplace | Buy and Sell",
  description:
    "Discover products from trusted sellers across every category.",
};

// Simple skeleton fallbacks so each section can stream in independently
function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div
      className={`w-full ${height} animate-pulse rounded-lg bg-gray-100`}
      aria-hidden="true"
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <Hero />
      </Suspense>

      <section aria-label="Categories" className="mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<SectionSkeleton />}>
          <CategoryGrid />
        </Suspense>
      </section>

      <section
        aria-label="Featured products"
        className="mx-auto max-w-7xl px-4 py-12"
      >
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      <section
        aria-label="Marketplace statistics"
        className="mx-auto max-w-7xl px-4 py-12"
      >
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <MarketplaceStats />
        </Suspense>
      </section>

      <Suspense fallback={<SectionSkeleton height="h-48" />}>
        <SellerCTA />
      </Suspense>
    </main>
  );
}
