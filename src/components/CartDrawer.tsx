"use client";

import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-yellow-400" />
                <h2 className="font-serif text-2xl">Your Cart</h2>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-white/70">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag size={48} className="text-white/30" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-yellow-400 hover:text-yellow-300 underline underline-offset-4"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
                  >
                    <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        loader={sanityLoader}
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        placeholder={item.lqip ? "blur" : "empty"}
                        blurDataURL={item.lqip}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg leading-tight pr-4">
                          {item.slug ? (
                            <Link 
                                href={`/product/${item.slug}`} 
                                onClick={() => setIsCartOpen(false)}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                {item.name}
                            </Link>
                          ) : item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-yellow-400 font-medium">${item.price}</p>
                        <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="text-white/50 hover:text-white transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="text-white/50 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₵{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <span className="text-sm text-white/60 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-serif text-yellow-400">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-white text-black font-medium py-4 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wide text-sm mt-4"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
