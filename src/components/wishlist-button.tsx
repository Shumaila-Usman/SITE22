"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Product } from "@/lib/products";
import { AuthModal } from "@/components/auth-modal";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  showLabel?: boolean;
}

export function WishlistButton({ product, className, showLabel = false }: WishlistButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [popped, setPopped] = useState(false);

  const inWishlist = isInWishlist(product.id);

  function handleClick() {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem({
        productId: product.id,
        code: product.code,
        name: product.name,
        subCategory: product.subCategory,
        image: product.image,
        moq: product.moq,
        price: product.price,
      });
      setPopped(true);
      setTimeout(() => setPopped(false), 600);
    }
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.88 }}
        className={cn(
          "relative flex items-center gap-2 rounded-lg border transition-all duration-200",
          inWishlist
            ? "border-red-500/50 bg-red-500/15 text-red-400"
            : "border-white/[0.1] bg-white/[0.04] text-zinc-400 hover:border-red-500/30 hover:text-red-400",
          showLabel ? "px-4 py-2.5" : "h-9 w-9 justify-center",
          className,
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={inWishlist ? "filled" : "empty"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: popped ? 1.3 : 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-red-500")}
            />
          </motion.span>
        </AnimatePresence>
        {showLabel && (
          <span className="text-xs font-semibold uppercase tracking-wide">
            {inWishlist ? "Saved" : "Save"}
          </span>
        )}
      </motion.button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
