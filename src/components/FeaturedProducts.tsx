"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import GlassCard from "./GlassCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full py-20 px-6 max-w-7xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl md:text-5xl mb-12 text-center"
      >
        Featured Collection
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map((product, index) => (
          <GlassCard 
            key={product._id}
            className="aspect-[3/4] flex flex-col justify-between group cursor-pointer hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 active:bg-white/10 active:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:border-white/30 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative flex-1 w-full mb-4">
              {product.imageUrl && (
                <Image
                  loader={sanityLoader}
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg md:text-xl mb-1">{product.name}</h3>
              <p className="text-white/60 text-sm font-sans">${product.price}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
