"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function FlyToCart() {
  const { flyingImage, cartBtnRef } = useCart();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (flyingImage && cartBtnRef.current) {
      setTargetRect(cartBtnRef.current.getBoundingClientRect());
    }
  }, [flyingImage, cartBtnRef]);

  if (!flyingImage || !targetRect) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <motion.img
        src={flyingImage.imageUrl}
        className="absolute object-cover shadow-2xl border-2 border-yellow-400 z-50"
        initial={{
          top: flyingImage.startRect.top,
          left: flyingImage.startRect.left,
          width: flyingImage.startRect.width,
          height: flyingImage.startRect.height,
          opacity: 1,
          borderRadius: "1rem", // Start with rounded corners
        }}
        animate={{
          top: targetRect.top + 5, // Adjust to center on icon
          left: targetRect.left + 5,
          width: 30, // Target size
          height: 30,
          opacity: 0.5, // Fade out slightly at the end
          borderRadius: "50%", // Become a circle
          scale: 0.5, // Shrink effect
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={() => {
            // Optional: could trigger something here
        }}
      />
    </div>
  );
}
