"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, User, Truck, BookOpen, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import GlassCard from "./GlassCard";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: Text moves slower (stays longer) by moving down as we scroll down
  const textY = useTransform(scrollYProgress, [0, 1], [0, 300]); 
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const smockY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const cardY1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const cardY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden pt-24 pb-12 px-6 flex flex-col justify-center">
      {/* Background Text (Desktop & Mobile) */}
      <motion.div 
        style={{ y: textY, opacity }}
        className="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none select-none"
      >
        <h1 className="font-serif font-bold text-[22vw] md:text-[20vw] leading-[0.8] tracking-tighter text-white opacity-90">
          HERITAGE
        </h1>
      </motion.div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen md:min-h-0 md:h-[80vh] grid grid-cols-2 grid-rows-[auto_1fr_auto] md:grid-cols-12 md:grid-rows-12 gap-3 md:gap-4 p-4 md:p-0">
        
        {/* Central Smock Image */}
        <motion.div 
          style={{ y: smockY }}
          className="col-span-2 row-start-2 md:col-span-4 md:col-start-5 md:row-span-8 md:row-start-2 relative z-10 flex items-center justify-center aspect-[4/5] md:aspect-auto md:order-none"
        >
          {/* Inner div for entrance animation */}
          <motion.div
            className="relative w-full h-full md:w-[140%] md:h-[140%] md:translate-y-16 p-4"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
              <Image 
                src="/smock.png"
                alt="African Smock"
                fill
                priority
                className="object-contain object-center drop-shadow-2xl"
              />
          </motion.div>
        </motion.div>

        {/* Top Left Card - APPAREL */}
        <motion.div
            style={{ y: cardY1 }}
            className="col-span-1 row-start-1 md:col-span-3 md:row-span-3 md:order-none z-20 h-40 md:h-auto"
        >
            <Link href="/track-order" className="block h-full w-full">
            <GlassCard 
                className="h-full w-full flex flex-col justify-between relative group overflow-hidden !backdrop-blur-xl !bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-between h-full p-2 md:p-4">
                    <div className="flex justify-between items-start">
                        <Truck className="text-white/80 w-6 h-6 md:w-8 md:h-8" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg md:text-2xl mb-1 text-white">TRACK ORDER</h3>
                        <p className="text-[9px] md:text-xs text-white/60">
                            Follow your package&apos;s journey.
                        </p>
                    </div>
                </div>
            </GlassCard>
            </Link>
        </motion.div>

        {/* Right Side Card - TEXTILES */}
        <motion.div
            style={{ y: cardY2 }}
            className="col-span-1 row-start-1 md:col-span-3 md:col-start-10 md:row-span-3 md:row-start-1 md:order-none z-20 h-40 md:h-auto md:-translate-y-8"
        >
            <Link href="/shipping-returns" className="block h-full w-full">
            <GlassCard 
                className="h-full w-full flex flex-col justify-between relative group overflow-hidden !backdrop-blur-xl !bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-between h-full p-2 md:p-4">
                     <div>
                        <h3 className="font-serif text-lg md:text-2xl mb-1 text-white">SHIPPING & RETURNS</h3>
                        <p className="text-[9px] md:text-xs text-white/60">
                            Global delivery and easy returns.
                        </p>
                    </div>
                    <div className="self-end">
                        <RefreshCw className="text-white/80 w-6 h-6" />
                    </div>
                </div>
            </GlassCard>
            </Link>
        </motion.div>

        {/* Bottom Left - FOOTWEAR */}
        <motion.div
            style={{ y: cardY1 }}
            className="col-span-1 row-start-3 md:col-span-4 md:row-span-4 md:row-start-8 md:order-none z-20 h-48 md:h-auto"
        >
            <Link href="/blog" className="block h-full w-full">
            <GlassCard 
                className="h-full w-full flex flex-col justify-end relative group overflow-hidden !backdrop-blur-xl !bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex justify-between items-end p-2 md:p-4">
                    <h3 className="font-serif text-lg md:text-3xl text-white">BLOG</h3>
                    <BookOpen className="text-white/80 w-6 h-6 md:w-8 md:h-8" />
                </div>
            </GlassCard>
            </Link>
        </motion.div>

        {/* Bottom Right - JEWELRY */}
        <motion.div
            style={{ y: cardY2 }}
            className="col-span-1 row-start-3 md:col-span-3 md:col-start-10 md:row-span-5 md:row-start-8 md:order-none z-20 h-48 md:h-auto"
        >
            <Link href="/team" className="block h-full w-full">
            <GlassCard 
                className="h-full w-full relative group overflow-hidden !backdrop-blur-xl !bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 
                 <div className="relative z-10 h-full flex flex-col justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center">
                            <User size={14} className="md:w-5 md:h-5 text-white/80" />
                        </div>
                        <div className="text-xs md:text-sm leading-tight">
                            <div className="font-bold tracking-wide">TEAM</div>
                            <div className="text-white/50 text-[10px] md:text-xs">Meet the creators</div>
                        </div>
                    </div>
                 </div>
            </GlassCard>
            </Link>
        </motion.div>

      </div>
    </section>
  );
}

function CircleButton() {
    return (
        <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
        >
            <ArrowRight size={16} className="text-white/80" />
        </motion.button>
    )
}
