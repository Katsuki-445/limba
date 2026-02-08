import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Image from "next/image";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import FlyToCart from "@/components/FlyToCart";
import CartDrawer from "@/components/CartDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import { client } from "@/sanity/lib/client";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b", // zinc-950
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    title,
    description,
    "ogImageUrl": ogImage.asset->url
  }`);

  return {
    title: settings?.title || "LIMBA - Heritage Reimagined",
    description: settings?.description || "High-end luxury fashion landing page",
    openGraph: settings?.ogImageUrl ? {
      images: [settings.ogImageUrl]
    } : undefined
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-zinc-950 text-white min-h-screen relative`}
        suppressHydrationWarning
      >
        {/* Main Background */}
        <div className="fixed inset-0 z-[-2] print:hidden">
          <Image 
            src="/boutique.png" 
            alt="Background" 
            fill 
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        {/* Grain Overlay - Disabled for performance
        <div className="fixed inset-0 z-[-1] opacity-5 pointer-events-none mix-blend-overlay print:hidden">
          <Image 
            src="/grain.png" 
            alt="Grain" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        */}

        <CartProvider>
          <SmoothScroll>
            <FlyToCart />
            <CartDrawer />
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
