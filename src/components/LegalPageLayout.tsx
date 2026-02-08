"use client";

import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

// Custom components for Portable Text to match the site's theme
const ptComponents = {
  block: {
    h1: ({children}: any) => <h1 className="text-3xl font-serif mb-6 mt-10 text-white border-b border-white/10 pb-2">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-serif mb-4 mt-8 text-yellow-400">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-serif mb-3 mt-6 text-white/90">{children}</h3>,
    normal: ({children}: any) => <p className="mb-4 text-white/80 leading-relaxed font-light text-base md:text-lg">{children}</p>,
    blockquote: ({children}: any) => <blockquote className="border-l-2 border-yellow-400 pl-4 italic my-6 text-white/70">{children}</blockquote>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc pl-5 mb-6 text-white/80 space-y-2 font-light">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal pl-5 mb-6 text-white/80 space-y-2 font-light">{children}</ol>,
  },
  marks: {
    strong: ({children}: any) => <strong className="font-bold text-white">{children}</strong>,
    link: ({value, children}: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-yellow-400 hover:underline">
          {children}
        </a>
      )
    },
  },
};

export default function LegalPageLayout({ title, content }: { title: string, content: any }) {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl mb-12 text-center">{title}</h1>
        <GlassCard className="p-6 md:p-12">
            {content ? (
                <div className="prose prose-invert max-w-none">
                    <PortableText value={content} components={ptComponents} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-white/50 italic mb-2">Content coming soon...</p>
                    <p className="text-white/30 text-sm">Please update this section in the Site Settings.</p>
                </div>
            )}
        </GlassCard>
      </motion.div>
    </main>
  );
}
