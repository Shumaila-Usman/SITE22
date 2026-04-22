import { cn } from "@/lib/utils";

/**
 * Megacore International logo mark.
 * Recreated as SVG from the brand asset.
 * Swap `useSvg={false}` and provide an <Image> if you place logo.png in /public.
 */
export function MegacoreLogo({
  className,
  iconOnly = false,
  size = "md",
}: {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = { sm: 28, md: 40, lg: 64 }[size];
  const textSize = {
    sm: { brand: "text-[11px]", sub: "text-[7px]" },
    md: { brand: "text-[15px]", sub: "text-[9px]" },
    lg: { brand: "text-[24px]", sub: "text-[13px]" },
  }[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* ── Icon mark ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Outer C-arc — open on the right */}
        <path
          d="M80 18 A42 42 0 1 0 80 82"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner letterform — stylised double-pillar M */}
        {/* Left pillar */}
        <rect x="30" y="28" width="10" height="44" rx="2" fill="white" />
        {/* Right pillar */}
        <rect x="60" y="28" width="10" height="44" rx="2" fill="white" />
        {/* Centre diagonal — top-left to bottom-right */}
        <path
          d="M40 28 L60 72"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Centre diagonal — top-right to bottom-left */}
        <path
          d="M60 28 L40 72"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ── */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-black uppercase tracking-[0.18em] text-white",
              textSize.brand,
            )}
          >
            Megacore
          </span>
          <span
            className={cn(
              "font-light uppercase tracking-[0.28em] text-zinc-400",
              textSize.sub,
            )}
          >
            International
          </span>
        </div>
      )}
    </div>
  );
}
