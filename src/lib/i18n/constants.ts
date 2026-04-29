export const LOCALE_STORAGE_KEY = "mci_locale";

export const LOCALES = ["en", "ur", "ar"] as const;

export type AppLocale = (typeof LOCALES)[number];

export function isRtlLocale(locale: AppLocale): boolean {
  return locale === "ur" || locale === "ar";
}

export function htmlLangFor(locale: AppLocale): string {
  return locale;
}
