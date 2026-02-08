"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

interface StoryClientProps {
  label?: string;
  headline?: string;
  content?: any;
}

export default function StoryClient({ label, headline, content }: StoryClientProps) {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/boutique.png"
          alt="Boutique Background"
          fill
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-white/60 mb-6 block">
            {label || "Our Heritage"}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-12 leading-tight">
            {headline || (
              <>
                Weaving the Threads of <br />
                <span className="italic text-white/80">Ancestral Elegance</span>
              </>
            )}
          </h1>
          
          <div className="space-y-8 text-lg md:text-xl font-light leading-relaxed text-white/80 max-w-2xl mx-auto">
            {content ? (
              <PortableText 
                value={content} 
                components={{
                    block: {
                        normal: ({children}) => <p>{children}</p>
                    }
                }}
              />
            ) : (
              <>
                <p>
                  At LIMBA, we believe that true luxury lies in the stories we wear. 
                  Our journey began in the heart of Ghana, where the rhythmic clatter 
                  of the loom is the heartbeat of the community.
                </p>
                <p>
                  Every smock, every bead, and every pair of Ahenema sandals is 
                  handcrafted by master artisans who have inherited their skills 
                  through generations. We don&apos;t just sell fashion; we preserve a legacy.
                </p>
                <p>
                  Redefining African heritage for the modern world means honoring 
                  the past while embracing the future. Welcome to the new standard 
                  of cultural luxury.
                </p>
              </>
            )}
          </div>

          <div className="mt-16">
            <div className="w-px h-24 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
