"use client";

import { ShoppingBag, Search, Store } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function BottomNav() {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-[20px] border border-white/10 shadow-lg"
    >
      <NavIcon icon={Store} label="Shop" />
      <NavIcon icon={Search} label="Search" />
      <div className="w-px h-6 bg-white/20 mx-1" />
      <NavIcon icon={ShoppingBag} label="Cart" isGold />
    </motion.div>
  );
}

function NavIcon({ icon: Icon, label, isGold }: { icon: React.ElementType, label: string, isGold?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 rounded-full flex items-center justify-center transition-colors ${
        isGold ? "bg-amber-500/20 text-amber-400" : "hover:bg-white/10 text-white/80 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}
