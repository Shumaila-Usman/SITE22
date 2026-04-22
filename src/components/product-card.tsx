"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Product, productUrl } from "@/lib/products";
import { useAuthStore } from "@/lib/store";
import { WishlistButton } from "@/components/wishlist-button";
import { AuthModal } from "@/components/auth-modal";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/60 transition-colors hover:border-white/[0.12]",
          className,
        )}
      >
        {/* Image area */}
        <Link href={productUrl(product)} className="relative block aspect-[4/3] overflow-hidden bg-zinc-800/60">
          {/* Placeholder gradient — swap with <Image> when real photos available */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              {product.code}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-red-600/0 transition-colors duration-300 group-hover:bg-red-600/[0.06]" />
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category badge */}
          <span className="mb-2 text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {product.subCategory}
          </span>

          {/* Name */}
          <Link href={productUrl(product)}>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-red-300">
              {product.name}
            </h3>
          </Link>

          {/* Code */}
          <span className="mb-3 text-[10px] font-mono text-zinc-500">{product.code}</span>

          {/* Short desc */}
          <p className="mb-4 flex-1 text-xs leading-relaxed text-zinc-400 line-clamp-2">
            {product.description}
          </p>

          {/* MOQ */}
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-400">
              MOQ {product.moq} pcs
            </span>
          </div>

          {/* Price + wishlist row */}
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
            {/* Price */}
            {isAuthenticated ? (
              <div>
                {product.price ? (
                  <span className="text-sm font-bold text-white">
                    {product.currency} {product.price.toFixed(2)}
                    <span className="ml-1 text-[10px] font-normal text-zinc-500">/pc</span>
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">Contact for price</span>
                )}
              </div>
            ) : (
              <button
                suppressHydrationWarning
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <Lock className="h-3 w-3" />
                Login to view price
              </button>
            )}

            {/* Wishlist — only for authenticated */}
            {isAuthenticated && (
              <WishlistButton product={product} />
            )}
          </div>
        </div>
      </motion.div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
