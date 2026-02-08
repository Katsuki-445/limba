"use client";

import Link from "next/link";
import GlassCard from "./GlassCard";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import { ArrowUpRight } from "lucide-react";

interface Category {
  _id: string;
  title: string;
  description: string;
  layoutClass?: string;
  imageUrl: string;
  lqip?: string;
}

interface CategoryBentoProps {
  categories: Category[];
}

export default function CategoryBento({ categories }: CategoryBentoProps) {
  return (
    <section className="w-full pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="font-serif text-3xl md:text-5xl mb-3">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-[200px] md:auto-rows-[350px]">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/collections?category=${encodeURIComponent(cat.title)}`} className={cat.layoutClass || ''}>
          <GlassCard 
            className="group relative overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 active:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:border-white/30 transition-all duration-500 h-full"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
             <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} className="md:w-5 md:h-5" />
             </div>

             <div className="absolute inset-0 z-0">
                {cat.imageUrl && (
                  <Image
                    loader={sanityLoader}
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    placeholder={cat.lqip ? "blur" : "empty"}
                    blurDataURL={cat.lqip}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
             </div>

             <div className="relative z-10 h-full flex flex-col justify-end p-3 md:p-4">
                <h3 className="font-serif text-lg md:text-4xl mb-1 md:mb-2">{cat.title}</h3>
                <p className="text-white/60 font-sans tracking-wide uppercase text-[10px] md:text-xs">{cat.description}</p>
             </div>
          </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
