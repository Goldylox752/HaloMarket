import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";


export const metadata = {
  title: "Halo Market | Buy & Sell Across Canada",
  description:
    "A modern Canadian marketplace to buy, sell, and discover products.",
};


export default function RootLayout({children}) {

return (

<html lang="en">

<body>

<Navbar />

{children}

<Footer />

</body>

</html>

);

}