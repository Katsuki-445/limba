"use client";

import { Search, User, Menu, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Our Story", href: "/story" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, cartBtnRef, setIsCartOpen } = useCart();
  const router = useRouter();

  // Refs for specific buttons to handle responsive switching
  const desktopCartRef = useRef<HTMLButtonElement>(null);
  const mobileCartRef = useRef<HTMLButtonElement>(null);

  // Sync the correct ref to the context based on viewport
  useEffect(() => {
    const updateRef = () => {
      // 768px is the 'md' breakpoint in Tailwind
      if (window.innerWidth >= 768) {
        if (cartBtnRef && 'current' in cartBtnRef) {
          // We know we can assign to current
          cartBtnRef.current = desktopCartRef.current;
        }
      } else {
        if (cartBtnRef && 'current' in cartBtnRef) {
          // We know we can assign to current
          cartBtnRef.current = mobileCartRef.current;
        }
      }
    };

    // Initial check
    updateRef();

    // Listen for resize
    window.addEventListener('resize', updateRef);
    return () => window.removeEventListener('resize', updateRef);
  }, [cartBtnRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/5 transition-all print:hidden">
        <div className="pointer-events-auto flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <form onSubmit={handleSearch} className="relative group hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all backdrop-blur-md w-32 focus:w-48"
            />
          </form>
        </div>

        <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto">
          <Link href="/" className="font-sans font-medium tracking-widest text-sm uppercase">LIMBA</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
          <button 
            ref={desktopCartRef}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md group"
          >
            <ShoppingBag size={18} className="text-white group-hover:text-yellow-400 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Cart & Search */}
        <div className="md:hidden pointer-events-auto flex items-center gap-2">
          <button 
            className="p-2 text-white"
            onClick={() => setIsSearchOpen(true)}
          >
              <Search size={24} />
          </button>
          <button 
            ref={mobileCartRef}
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-white relative"
          >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-zinc-950/95 backdrop-blur-xl md:hidden flex flex-col p-6"
          >
             <div className="flex justify-between items-center mb-8">
              <span className="font-sans font-medium tracking-widest text-sm uppercase">Search</span>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="w-full">
              <input
                autoFocus
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-4 text-2xl text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors font-serif"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-zinc-950/95 backdrop-blur-xl md:hidden flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-sans font-medium tracking-widest text-sm uppercase">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-3xl text-white/90 hover:text-white hover:pl-4 transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <p className="text-white/30 text-xs text-center">
                &copy; 2026 LIMBA. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
