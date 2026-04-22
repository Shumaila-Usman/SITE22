"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Product } from "@/lib/products";
import { useAuthStore } from "@/lib/store";
import { WishlistButton } from "@/components/wishlist-button";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";

export function ProductDetailClient({ product }: { product: Product }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className="mb-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5">
        {isAuthenticated ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Price Per Piece</p>
            <p className="mt-1 text-2xl font-black text-white">
              {product.price ? `${product.currency} ${product.price.toFixed(2)}` : "Contact for pricing"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Prices vary by quantity and customization. Contact us for a formal quote.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Lock className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Price hidden</p>
              <p className="text-xs text-zinc-400">
                <button suppressHydrationWarning onClick={() => setAuthOpen(true)} className="text-red-400 underline hover:text-red-300">
                  Login or register
                </button>{" "}
                to view pricing and save to wishlist.
              </p>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <WishlistButton product={product} showLabel className="w-full justify-center" />
      ) : (
        <Button onClick={() => setAuthOpen(true)} className="w-full">
          Sign In to Save & View Price
        </Button>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
