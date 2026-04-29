"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import enMessages from "@/locales/en.json";
import urMessages from "@/locales/ur.json";
import arMessages from "@/locales/ar.json";
import {
  LOCALE_STORAGE_KEY,
  type AppLocale,
  LOCALES,
  htmlLangFor,
  isRtlLocale,
} from "@/lib/i18n/constants";
import { getNestedString, interpolate } from "@/lib/i18n/nested-get";

const bundles: Record<AppLocale, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  ur: urMessages as Record<string, unknown>,
  ar: arMessages as Record<string, unknown>,
};

function isAppLocale(v: string | null): v is AppLocale {
  return v === "en" || v === "ur" || v === "ar";
}

type TranslateVars = Record<string, string | number | undefined>;

export type TranslateFn = (key: string, vars?: TranslateVars) => string;

type LanguageContextValue = {
  locale: AppLocale;
  setLanguage: (locale: AppLocale) => void;
  t: TranslateFn;
  /** True after reading localStorage on the client */
  hydrated: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolveMessage(locale: AppLocale, key: string): string {
  const primary = getNestedString(bundles[locale], key);
  if (primary !== undefined) return primary;
  const fallback = getNestedString(bundles.en, key);
  if (fallback !== undefined) return fallback;
  return key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (raw && isAppLocale(raw)) setLocale(raw);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.lang = htmlLangFor(locale);
    root.dir = isRtlLocale(locale) ? "rtl" : "ltr";
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLanguage = useCallback((next: AppLocale) => {
    if (!LOCALES.includes(next)) return;
    setLocale(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: TranslateVars) => {
      const raw = resolveMessage(locale, key);
      return interpolate(raw, vars);
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLanguage, t, hydrated }),
    [locale, setLanguage, t, hydrated],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
