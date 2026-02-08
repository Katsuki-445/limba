"use client";

import { useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <GlassCard className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <AlertTriangle className="text-red-400 w-8 h-8" />
        </div>
        
        <h2 className="font-serif text-2xl mb-4">Something went wrong</h2>
        <p className="text-white/60 font-light mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        <button
          onClick={reset}
          className="bg-white text-black font-sans text-sm font-medium uppercase tracking-widest py-3 px-8 rounded-full hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Try Again
        </button>
      </GlassCard>
    </div>
  );
}
