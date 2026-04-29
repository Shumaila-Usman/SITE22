"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Product } from "@/lib/products";
import { useAuthStore } from "@/lib/store";
import { WishlistButton } from "@/components/wishlist-button";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function ProductDetailClient({ product }: { product: Product }) {
  const { t } = useLanguage();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className="mb-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5">
        {isAuthenticated ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("productDetail.pricePerPiece")}</p>
            <p className="mt-1 text-2xl font-black text-white">
              {product.price ? `${product.currency} ${product.price.toFixed(2)}` : t("productDetail.contactForPricing")}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {t("productDetail.priceFootnote")}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Lock className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t("productDetail.priceHiddenTitle")}</p>
              <p className="text-xs text-zinc-400">
                <button suppressHydrationWarning onClick={() => setAuthOpen(true)} className="text-red-400 underline hover:text-red-300">
                  {t("productDetail.loginRegister")}
                </button>{" "}
                {t("productDetail.loginRegisterSuffix")}
              </p>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <WishlistButton product={product} showLabel className="w-full justify-center" />
      ) : (
        <Button onClick={() => setAuthOpen(true)} className="w-full">
          {t("productDetail.signInSave")}
        </Button>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
