"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function StoryBanner({ headline, imageUrl, lqip }: { headline?: string, imageUrl?: string, lqip?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center bg-zinc-900">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
         <Image
            src={imageUrl || "/smock.png"}
            alt="Brand Story Background"
            fill
            className="object-cover opacity-40 scale-150 blur-sm"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
         />
         <div className="absolute inset-0 bg-black/40" />
      </motion.div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h2 
            style={{ opacity }}
            className="font-serif text-3xl md:text-5xl leading-tight tracking-wide text-white/90 drop-shadow-2xl italic"
        >
            &quot;{headline || "Hand-woven heritage, redefined for the modern world."}&quot;
        </motion.h2>
        <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-px bg-white/50 mx-auto mt-8"
        />
      </div>
    </section>
  );
}
