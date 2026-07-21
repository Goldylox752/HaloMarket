import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";


export const metadata = {

  title: {
    default: "Halo Market | Buy & Sell Across Canada",
    template: "%s | Halo Market",
  },

  description:
    "Halo Market is Canada's modern marketplace to buy, sell, and discover products from trusted sellers.",


  keywords: [
    "Canadian marketplace",
    "buy and sell Canada",
    "online marketplace",
    "classifieds Canada",
    "sell products online",
    "shopping Canada",
  ],


  openGraph: {

    title:
      "Halo Market | Buy & Sell Across Canada",

    description:
      "A modern Canadian marketplace connecting buyers and sellers.",

    siteName:
      "Halo Market",

    type:
      "website",

  },


  twitter: {

    card:
      "summary_large_image",

    title:
      "Halo Market | Buy & Sell Across Canada",

    description:
      "Discover products and sell online across Canada.",

  },


};



export const viewport = {

  width: "device-width",

  initialScale: 1,

  themeColor: "#4f46e5",

};



export default function RootLayout({ children }) {

  return (

    <html lang="en">

      <body className="min-h-screen bg-gray-50 antialiased">


        <Navbar />


        <main>

          {children}

        </main>


        <Footer />


      </body>


    </html>

  );

}