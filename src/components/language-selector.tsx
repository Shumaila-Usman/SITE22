"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { AppLocale } from "@/lib/i18n/constants";
import { LOCALES } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        suppressHydrationWarning
        className="flex h-9 items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/20 hover:text-white md:px-3"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("header.language")}
      >
        {t(`language.${locale}`)}
        <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 top-full z-[60] mt-2 min-w-[88px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0505] py-1 shadow-xl"
        >
          {LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  locale === code
                    ? "bg-red-600/20 text-red-300"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                )}
                onClick={() => {
                  setLanguage(code as AppLocale);
                  setOpen(false);
                }}
              >
                {t(`language.${code}`)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
