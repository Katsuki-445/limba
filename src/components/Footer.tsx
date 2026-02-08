"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-50 w-full bg-zinc-900 pt-14 pb-20 px-6 border-t border-white/5 print:hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-4xl mb-6">LIMBA</h2>
            <p className="text-white/50 max-w-sm leading-relaxed">
                Reimagining African heritage through modern luxury. Every piece tells a story of craftsmanship, culture, and timeless elegance.
            </p>
        </div>

        <div>
             <h3 className="font-serif text-lg mb-6 text-white/80">Payment Methods</h3>
             <div className="flex gap-4 items-center mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded border border-white/10">
                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                    <span className="text-xs font-bold text-white/80">MTN MoMo</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded border border-white/10">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-xs font-bold text-white/80">Telecel</span>
                </div>
             </div>
             <p className="text-xs text-white/30">
                Secure payments powered by Paystack
             </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
        <p>&copy; 2026 LIMBA. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
