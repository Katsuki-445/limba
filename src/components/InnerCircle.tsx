"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function InnerCircle() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="w-full py-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-5xl text-white mb-12 tracking-wide"
        >
          JOIN THE INNER CIRCLE
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative flex items-end gap-4 max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          {status === "success" ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full text-center py-4 text-[#D4AF37] font-serif text-lg tracking-wide flex items-center justify-center gap-2"
             >
               <Check size={20} />
               <span>Welcome to the circle.</span>
             </motion.div>
          ) : (
            <>
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors font-light tracking-wide disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="pb-3 text-[#D4AF37] hover:text-[#F4CF57] font-serif tracking-widest text-sm uppercase transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {status === "loading" && <Loader2 className="animate-spin" size={14} />}
                JOIN
              </button>
            </>
          )}
        </motion.form>
        {status === "error" && (
           <p className="mt-4 text-red-400 text-sm">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
