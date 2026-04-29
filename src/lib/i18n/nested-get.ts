/**
 * Resolves dot paths like "navbar.home" or "sections.faq.items.0.q".
 * Supports arrays at numeric path segments.
 */
export function getNested(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) {
      const i = Number(part);
      if (!Number.isInteger(i) || String(i) !== part || i < 0 || i >= cur.length) {
        return undefined;
      }
      cur = cur[i];
    } else if (typeof cur === "object" && part in cur) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function getNestedString(obj: unknown, path: string): string | undefined {
  const v = getNested(obj, path);
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number | undefined>,
): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = vars[key];
    return val === undefined || val === null ? "" : String(val);
  });
}
