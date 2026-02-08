"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 border-2 border-white/20 border-t-yellow-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="font-serif text-white/60 tracking-widest text-sm uppercase"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading Limba...
        </motion.p>
      </div>
    </div>
  );
}
