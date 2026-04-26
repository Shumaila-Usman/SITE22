"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GarmentCategory, GarmentTemplate } from "@/lib/customization-types";

export type { GarmentCategory, GarmentTemplate } from "@/lib/customization-types";

const CATEGORIES: GarmentCategory[] = [
  "All",
  "Hoodies",
  "T-Shirts",
  "Jackets",
  "Trousers",
  "Shorts",
  "Sweatshirts",
  "Tank Tops",
  "Tote Bags",
  "Caps",
];

interface TemplateSelectorProps {
  onSelect?: (template: GarmentTemplate) => void;
  selectedId?: string;
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>("All");
  const [selected, setSelected] = useState<GarmentTemplate | null>(null);
  const [templates, setTemplates] = useState<GarmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/customization/templates");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        if (!cancelled) setTemplates(data.templates ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load templates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentSelectedId = selectedId ?? selected?.id;
  const resolvedSelected =
    templates.find((t) => t.id === currentSelectedId) ?? selected ?? null;

  const filtered =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  function handleSelect(template: GarmentTemplate) {
    setSelected(template);
    onSelect?.(template);
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 touch-manipulation rounded-full border px-3 py-2 text-[11px] font-semibold transition-all duration-200 active:opacity-90 sm:px-4 sm:py-1.5 sm:text-xs ${
              activeCategory === cat
                ? "border-red-500 bg-red-500/15 text-red-400"
                : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-zinc-500">Loading garment templates…</div>
      )}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {filtered.map((template) => {
              const isSelected = currentSelectedId === template.id;
              return (
                <motion.button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelect(template)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative flex touch-manipulation flex-col overflow-hidden rounded-xl border transition-all duration-200 active:opacity-95 ${
                    isSelected
                      ? "border-red-500 bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_4px_20px_rgba(239,68,68,0.15)]"
                      : "border-white/[0.07] bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow">
                      ✓
                    </span>
                  )}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-800/60">
                    <Image
                      src={template.thumbnailPath}
                      alt={template.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="px-2 py-2 text-center">
                    <p
                      className={`truncate text-[11px] font-semibold leading-tight transition-colors ${
                        isSelected ? "text-red-300" : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {template.name}
                    </p>
                    <p className="mt-0.5 text-[9px] text-zinc-600">{template.category}</p>
                  </div>
                </motion.button>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-zinc-600">
                No templates in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {(resolvedSelected || currentSelectedId) && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
            {resolvedSelected && (
              <Image
                src={resolvedSelected.thumbnailPath}
                alt={resolvedSelected.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{resolvedSelected?.name ?? currentSelectedId}</p>
            <p className="text-[10px] text-zinc-500">
              {resolvedSelected?.category ?? "—"} · Selected
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
