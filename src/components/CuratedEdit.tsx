"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import GlassCard from "./GlassCard";
import sanityLoader from "@/lib/sanityLoader";

interface Category {
  _id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
}

interface CuratedEditProps {
  categories: Category[];
}

export default function CuratedEdit({ categories }: CuratedEditProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-24 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-5xl text-white mb-12 text-left"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <Link key={cat._id || index} href={`/collections?category=${encodeURIComponent(cat.title)}`} className="block w-full h-[300px] md:h-[400px]">
              <GlassCard
                className="h-full w-full relative overflow-hidden group !backdrop-blur-xl !bg-white/5 hover:!bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-500"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {cat.imageUrl && (
                    <Image
                    loader={sanityLoader}
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-between h-full p-8">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-white/50 uppercase tracking-widest">
                      0{index + 1}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-green-500/50 transition-colors" />
                  </div>

                  <div className="mt-auto">
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
                      {cat.title}
                    </h3>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <p className="text-sm text-white/60">
                        {cat.description}
                      </p>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
