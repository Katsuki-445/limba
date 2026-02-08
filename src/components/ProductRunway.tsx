"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import Link from "next/link";
import GlassCard from "./GlassCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  lqip?: string;
}

interface ProductRunwayProps {
  products: Product[];
}

export default function ProductRunway({ products }: ProductRunwayProps) {
  if (!products || products.length === 0) return null;

  // If we have very few products, use the full list for both rows to maintain the visual effect
  const useFullList = products.length < 6;
  
  const row1 = useFullList ? products : products.slice(0, Math.ceil(products.length / 2));
  const row2 = useFullList ? [...products].reverse() : products.slice(Math.ceil(products.length / 2));

  // Helper to ensure we have enough items for a smooth animation loop
  // We want at least 10 items in the scrolling list to ensure the track is long enough
  // for the 40s (or 20s) animation duration to feel "fast" enough.
  const ensureMinLength = (items: Product[], min: number) => {
    if (items.length === 0) return [];
    let result = [...items];
    while (result.length < min) {
      result = [...result, ...items];
    }
    return result;
  };

  const row1Display = ensureMinLength(row1, 10);
  const row2Display = ensureMinLength(row2, 10);

  return (
    <section className="w-full py-12 overflow-hidden" id="collections">
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8 px-6 max-w-7xl mx-auto"
      >
        <h2 className="font-serif text-3xl md:text-4xl">Featured Collections</h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Row 1 - Moves Left */}
        <div className="relative w-full flex overflow-hidden group">
          <div className="flex gap-6 animate-scroll-left group-hover:pause whitespace-nowrap px-3">
             {/* Duplicate array to ensure smooth infinite scroll */}
             {[...row1Display, ...row1Display].map((product, index) => (
                <Link key={`${product._id}-${index}-r1`} href={`/product/${product.slug}`} className="block">
                  <GlassCard 
                    className="w-[160px] md:w-[320px] h-[240px] md:h-[350px] flex-shrink-0 relative cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
                        {product.imageUrl && (
                          <Image 
                            loader={sanityLoader}
                            src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105 pb-12 md:pb-16"
                              sizes="(max-width: 768px) 160px, 320px"
                              loading="lazy"
                              placeholder={product.lqip ? "blur" : "empty"}
                              blurDataURL={product.lqip}
                          />
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <h3 className="font-serif text-sm md:text-xl mb-0.5 md:mb-1 truncate">{product.name}</h3>
                        <p className="text-white/60 text-[10px] md:text-sm">₵{product.price}</p>
                    </div>
                  </GlassCard>
                </Link>
             ))}
          </div>
        </div>

        {/* Row 2 - Moves Right */}
        <div className="relative w-full flex overflow-hidden group">
          <div className="flex gap-6 animate-scroll-right group-hover:pause whitespace-nowrap px-3">
             {[...row2Display, ...row2Display].map((product, index) => (
                <Link key={`${product._id}-${index}-r2`} href={`/product/${product.slug}`} className="block">
                  <GlassCard 
                    className="w-[160px] md:w-[320px] h-[240px] md:h-[350px] flex-shrink-0 relative cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
                        {product.imageUrl && (
                          <Image 
                            loader={sanityLoader}
                            src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105 pb-12 md:pb-16"
                              sizes="(max-width: 768px) 160px, 320px"
                              loading="lazy"
                              placeholder={product.lqip ? "blur" : "empty"}
                              blurDataURL={product.lqip}
                          />
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <h3 className="font-serif text-sm md:text-xl mb-0.5 md:mb-1 truncate">{product.name}</h3>
                        <p className="text-white/60 text-[10px] md:text-sm">₵{product.price}</p>
                    </div>
                  </GlassCard>
                </Link>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
