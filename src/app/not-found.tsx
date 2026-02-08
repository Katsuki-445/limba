"use client";

import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <GlassCard className="max-w-md w-full p-12 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
          <Search className="text-white/60 w-8 h-8" />
        </div>
        
        <h2 className="font-serif text-3xl mb-4">Page Not Found</h2>
        <p className="text-white/60 font-light mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link
          href="/"
          className="bg-white text-black font-sans text-sm font-medium uppercase tracking-widest py-3 px-8 rounded-full hover:bg-white/90 transition-colors"
        >
          Return Home
        </Link>
      </GlassCard>
    </div>
  );
}
