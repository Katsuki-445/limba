"use client";

import { useCart } from "@/context/CartContext";
import { useRef } from "react";

import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    lqip?: string;
    slug?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const imageRef = useRef<HTMLDivElement>(null);

  const getStartRect = (e: React.MouseEvent<HTMLElement>) => {
    const mainImage = document.querySelector('img[alt="' + product.name + '"]');
    if (mainImage) {
      return mainImage.getBoundingClientRect();
    }
    return (e.target as HTMLElement).getBoundingClientRect();
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const startRect = getStartRect(e);
    addToCart(product, startRect);
  };

  const handleBuyNow = () => {
    // Add to cart without animation if we are going straight to checkout?
    // Or maybe simple add.
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-white text-black font-medium py-4 px-8 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wide text-sm active:scale-95 duration-200"
      >
        Add to Cart
      </button>
      <button 
        onClick={handleBuyNow}
        className="flex-1 bg-transparent border border-white/30 text-white font-medium py-4 px-8 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide text-sm active:scale-95 duration-200"
      >
        Buy Now
      </button>
    </div>
  );
}
