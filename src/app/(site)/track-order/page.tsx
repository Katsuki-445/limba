"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setIsLoading(true);
      // Simulate a small delay or just push directly
      router.push(`/receipt/${orderId.trim()}`);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <h1 className="font-serif text-4xl md:text-5xl mb-4 text-center">Track Order</h1>
            <p className="text-center text-white/50 mb-8 font-light">Enter your order reference number to view your order details and status.</p>
            
            <GlassCard className="p-8">
                <form onSubmit={handleTrack} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Order Reference ID</label>
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g. LB-2535988905670-816"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20 font-mono text-sm"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-white text-black font-sans font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        {isLoading ? "Locating Order..." : "Track Order"}
                    </button>
                </form>
            </GlassCard>
        </motion.div>
    </main>
  );
}
