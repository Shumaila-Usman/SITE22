"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SubCategoryClient({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-bold text-white">No products yet</p>
        <p className="mt-2 text-sm text-zinc-500">
          Products for this category are being added. Contact us to discuss your requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.4) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
