"use client";

import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  categoryName: string;
  lqip?: string;
}

interface Category {
  _id: string;
  title: string;
}

interface CollectionsGridProps {
  products: Product[];
  categories: Category[];
}

export default function CollectionsGrid({ products, categories }: CollectionsGridProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { addToCart } = useCart();

  // Update selected category if URL params change
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [searchParams, selectedCategory]);

  const filteredProducts = selectedCategory === "All"  
    ? products 
    : products.filter(p => p.categoryName === selectedCategory);

  const categoryNames = ["All", ...categories.map(c => c.title)];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="font-serif text-5xl md:text-7xl mb-4">The Collection</h1>
        <p className="text-white/60 max-w-xl mx-auto font-sans font-light mb-8">
          Curated pieces representing the pinnacle of Ghanaian craftsmanship.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, index) => (
          <Link key={product._id} href={`/product/${product.slug}`} className="block h-full">
            <GlassCard
              className="group h-full flex flex-col overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[4/5] bg-white/5 p-8 flex items-center justify-center overflow-hidden">
                {product.imageUrl && (
                  <Image 
                    loader={sanityLoader}
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder={product.lqip ? "blur" : "empty"}
                    blurDataURL={product.lqip}
                  />
                )}
                
                {/* Direct Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    addToCart(product, rect);
                  }}
                  className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all duration-300 z-10"
                  aria-label="Add to cart"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl group-hover:text-yellow-400 transition-colors">{product.name}</h3>
                    <span className="font-sans text-white/60">₵{product.price}</span>
                 </div>
                 {product.categoryName && (
                    <span className="text-xs uppercase tracking-widest text-white/40 mt-auto">
                        {product.categoryName}
                    </span>
                 )}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </>
  );
}