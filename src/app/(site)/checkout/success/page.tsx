"use client";

import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag, Download } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-12 w-full text-center space-y-8">
      <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-500" />
          </div>
      </div>
      
      <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl">Order Confirmed!</h1>
          <p className="text-white/60 text-lg leading-relaxed">
              Thank you for your purchase. Your order has been successfully processed.
          </p>
          {reference && (
              <div className="bg-white/10 py-2 px-4 rounded-lg inline-block">
                  <p className="text-sm font-mono text-white/80 tracking-widest">ORDER REF: {reference}</p>
              </div>
          )}
      </div>

      {reference && (
          <div className="flex justify-center">
             <Link 
                href={`/receipt/${reference}`} 
                target="_blank"
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
             >
                 <Download size={18} />
                 Download Receipt
             </Link>
          </div>
      )}

      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-left space-y-4">
          <h3 className="font-serif text-xl border-b border-white/10 pb-4">What happens next?</h3>
          <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>We will carefully package your items with premium protection.</span>
              </li>
              <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Shipping confirmation will be sent within 24 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span>Estimated delivery is 3-5 business days.</span>
              </li>
          </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
              href="/collections" 
              className="flex-1 bg-white text-black font-medium py-4 px-8 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
              <ShoppingBag size={18} />
              Continue Shopping
          </Link>
          <Link 
              href="/" 
              className="flex-1 bg-transparent border border-white/30 text-white font-medium py-4 px-8 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
              <Home size={18} />
              Back to Home
          </Link>
      </div>
    </GlassCard>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto flex items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
