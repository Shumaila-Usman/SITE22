/**
 * Safe display for optional per-locale DB fields (future).
 * Falls back to primary `name` / `description` when translations are absent.
 */
export function translatedProductName(
  product: {
    name: string;
    translations?: Partial<Record<string, { name?: string }>>;
  },
  locale: string,
): string {
  const t = product.translations?.[locale]?.name?.trim();
  if (t) return t;
  return product.name;
}
