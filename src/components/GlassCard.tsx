"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
}

export default function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden transition-shadow duration-300",
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      {...props}
    >
      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
