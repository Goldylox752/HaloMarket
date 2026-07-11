import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Halo Marketplace | Canada's AI Powered Marketplace",
  description:
    "Buy and sell anything across Canada with Halo Marketplace. AI-powered shopping, secure payments, and real-time seller tools.",
  keywords: [
    "Canada marketplace",
    "buy and sell online",
    "AI marketplace",
    "ecommerce Canada",
    "Halo Marketplace"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>

        <Navbar />

        <main>
          {children}
        </main>

        <Footer />

      </body>

    </html>
  );
}
