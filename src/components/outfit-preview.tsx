"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductTemplate =
  | "jersey"
  | "shirt"
  | "trouser"
  | "tracksuit"
  | "hoodie"
  | "shorts"
  | "tshirt"
  | "sweatshirt"
  | "zip-hoodie"
  | "crop-hoodie"
  | "track-jacket"
  | "bomber"
  | "puffer"
  | "sweatpants"
  | "cargo-pants"
  | "shorts-cargo";
export type FabricPattern   = "solid" | "stripes" | "gradient" | "camo" | "diagonal" | "geometric" | "mesh" | "panel" | "chevron" | "honeycomb";
export type LogoPosition    = "chest" | "back" | "sleeve" | "none";
export type StripePosition  = "side" | "sleeve" | "shoulder" | "chest" | "vertical-center";
export type StripeCount     = 1 | 2 | 3;
export type StripeThickness = "thin" | "medium" | "thick";

export interface StripeConfig {
  enabled:    boolean;
  position:   StripePosition;
  count:      StripeCount;
  thickness:  StripeThickness;
  color:      string;
  color2?:    string;
  color3?:    string;
  bothSides?: boolean;
}

export interface PanelConfig {
  chestPanel?:  string;
  sidePanel?:   string;
  sleevePanel?: string;
  cuffColor?:   string;
  collarColor?: string;
}

export interface OutfitConfig {
  productTemplate: ProductTemplate;
  primaryColor:    string;
  secondaryColor:  string;
  accentColor:     string;
  sleeveColor:     string;
  collarColor:     string;
  stripeColor:     string;   // kept for backward compat
  logoUrl?:        string;
  logoPosition:    LogoPosition;
  customText?:     string;
  customNumber?:   string;
  fabricPattern:   FabricPattern;
  // Extended stripe system
  stripes?:        StripeConfig;
  // Panel colors (legacy + new)
  panelColor?:     string;
  cuffColor?:      string;
  panels?:         PanelConfig;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function thicknessPx(t: StripeThickness): number {
  return t === "thin" ? 3 : t === "medium" ? 6 : 11;
}

function PatternDefs({ id, c }: { id: string; c: OutfitConfig }) {
  const p = c.primaryColor;
  const s = c.secondaryColor;
  const a = c.accentColor;

  return (
    <defs>
      {/* Gradient top-to-bottom */}
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={p} />
        <stop offset="100%" stopColor={s} />
      </linearGradient>

      {/* Vertical stripes */}
      <pattern id={`vstripe-${id}`} patternUnits="userSpaceOnUse" width="16" height="16">
        <rect width="16" height="16" fill={p} />
        <rect width="8" height="16" fill={s} opacity="0.6" />
      </pattern>

      {/* Diagonal */}
      <pattern id={`diag-${id}`} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
        <rect width="14" height="14" fill={p} />
        <rect width="7" height="14" fill={s} opacity="0.55" />
      </pattern>

      {/* Geometric (diamond) */}
      <pattern id={`geo-${id}`} patternUnits="userSpaceOnUse" width="24" height="24">
        <rect width="24" height="24" fill={p} />
        <polygon points="12,2 22,12 12,22 2,12" fill={s} opacity="0.4" />
        <polygon points="12,6 18,12 12,18 6,12" fill={a} opacity="0.2" />
      </pattern>

      {/* Mesh / sports grid */}
      <pattern id={`mesh-${id}`} patternUnits="userSpaceOnUse" width="12" height="12">
        <rect width="12" height="12" fill={p} />
        <line x1="0" y1="0" x2="12" y2="12" stroke={a} strokeWidth="0.7" opacity="0.45" />
        <line x1="12" y1="0" x2="0" y2="12" stroke={a} strokeWidth="0.7" opacity="0.45" />
        <rect x="4" y="4" width="4" height="4" fill={s} opacity="0.15" />
      </pattern>

      {/* Camo */}
      <pattern id={`camo-${id}`} patternUnits="userSpaceOnUse" width="48" height="48">
        <rect width="48" height="48" fill={p} />
        <ellipse cx="10" cy="10" rx="8" ry="6" fill={s}  opacity="0.55" transform="rotate(20,10,10)" />
        <ellipse cx="32" cy="16" rx="7" ry="5" fill={a}  opacity="0.5"  transform="rotate(-15,32,16)" />
        <ellipse cx="20" cy="34" rx="9" ry="6" fill={s}  opacity="0.45" transform="rotate(35,20,34)" />
        <ellipse cx="42" cy="38" rx="6" ry="5" fill={a}  opacity="0.45" transform="rotate(10,42,38)" />
        <ellipse cx="6"  cy="34" rx="5" ry="7" fill={s}  opacity="0.4"  transform="rotate(-25,6,34)" />
        <ellipse cx="38" cy="6"  rx="5" ry="4" fill={a}  opacity="0.35" transform="rotate(40,38,6)" />
      </pattern>

      {/* Chevron */}
      <pattern id={`chevron-${id}`} patternUnits="userSpaceOnUse" width="20" height="20">
        <rect width="20" height="20" fill={p} />
        <polyline points="0,10 10,0 20,10" fill="none" stroke={s} strokeWidth="3.5" opacity="0.6" />
        <polyline points="0,20 10,10 20,20" fill="none" stroke={s} strokeWidth="3.5" opacity="0.6" />
      </pattern>

      {/* Honeycomb */}
      <pattern id={`honeycomb-${id}`} patternUnits="userSpaceOnUse" width="18" height="20.8">
        <rect width="18" height="20.8" fill={p} />
        <polygon points="9,1 17,5.4 17,14.2 9,18.6 1,14.2 1,5.4" fill="none" stroke={s} strokeWidth="1.2" opacity="0.5" />
        <polygon points="18,10.4 26,14.8 26,23.6 18,28 10,23.6 10,14.8" fill="none" stroke={s} strokeWidth="1.2" opacity="0.5" />
      </pattern>

      {/* Clip paths */}
      <clipPath id={`jersey-body-${id}`}>
        <path d="M55,30 L20,60 L30,80 L50,70 L50,220 L150,220 L150,70 L170,80 L180,60 L145,30 L125,20 L100,25 L75,20 Z" />
      </clipPath>
    </defs>
  );
}

function patternFill(id: string, c: OutfitConfig): string {
  switch (c.fabricPattern) {
    case "gradient":   return `url(#grad-${id})`;
    case "stripes":    return `url(#vstripe-${id})`;
    case "diagonal":   return `url(#diag-${id})`;
    case "geometric":  return `url(#geo-${id})`;
    case "mesh":       return `url(#mesh-${id})`;
    case "camo":       return `url(#camo-${id})`;
    case "chevron":    return `url(#chevron-${id})`;
    case "honeycomb":  return `url(#honeycomb-${id})`;
    default:           return c.primaryColor;
  }
}

// Render stripe lines for a given path region
function StripeLines({
  stripes, x1, y1, x2, y2, vertical = true,
}: {
  stripes: StripeConfig;
  x1: number; y1: number; x2: number; y2: number;
  vertical?: boolean;
}) {
  if (!stripes.enabled) return null;
  const w      = thicknessPx(stripes.thickness);
  const colors = [stripes.color, stripes.color2 ?? stripes.color, stripes.color3 ?? stripes.color];
  const gap    = w + 4;
  const mid    = vertical ? (x1 + x2) / 2 : (y1 + y2) / 2;

  const offsets: number[] = [];
  if (stripes.count === 1) offsets.push(0);
  if (stripes.count === 2) offsets.push(-gap / 2, gap / 2);
  if (stripes.count === 3) offsets.push(-gap, 0, gap);

  return (
    <>
      {offsets.map((off, i) => (
        vertical ? (
          <line key={i}
            x1={mid + off} y1={y1}
            x2={mid + off} y2={y2}
            stroke={colors[i]} strokeWidth={w} opacity="0.9"
            strokeLinecap="round"
          />
        ) : (
          <line key={i}
            x1={x1} y1={mid + off}
            x2={x2} y2={mid + off}
            stroke={colors[i]} strokeWidth={w} opacity="0.9"
            strokeLinecap="round"
          />
        )
      ))}
    </>
  );
}


// ─── Jersey ───────────────────────────────────────────────────────────────────
// Reference: slim athletic jersey, V-neck collar, short sleeves, side panels
function JerseySVG({ c }: { c: OutfitConfig }) {
  const id     = React.useId().replace(/:/g, "");
  const fill   = patternFill(id, c);
  const st     = c.stripes;
  const panel  = c.panels?.sidePanel  ?? c.panelColor ?? c.secondaryColor;
  const chest  = c.panels?.chestPanel ?? c.panelColor ?? c.secondaryColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;
  const collar = c.panels?.collarColor ?? c.collarColor;

  return (
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Left sleeve ── */}
      <path d="M62,38 L62,100 L46,100 L22,72 L30,52 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" strokeLinejoin="round" />
      {/* ── Right sleeve ── */}
      <path d="M138,38 L138,100 L154,100 L178,72 L170,52 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Sleeve panel overlay */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M62,38 L62,100 L52,100 L30,72 L36,54 Z" fill={slvPnl} opacity="0.5" />
          <path d="M138,38 L138,100 L148,100 L170,72 L164,54 Z" fill={slvPnl} opacity="0.5" />
        </>
      )}
      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (
        <>
          <StripeLines stripes={st} x1={30} y1={62} x2={62} y2={62} vertical={false} />
          <StripeLines stripes={st} x1={138} y1={62} x2={170} y2={62} vertical={false} />
        </>
      )}

      {/* ── Body ── */}
      <path d="M62,38 L62,218 L138,218 L138,38 L122,26 L112,20 L100,24 L88,20 L78,26 Z"
        fill={fill} stroke={c.accentColor} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Side panels */}
      <path d="M62,70 L62,218 L76,218 L76,70 Z" fill={panel} opacity="0.6" />
      <path d="M138,70 L138,218 L124,218 L124,70 Z" fill={panel} opacity="0.6" />

      {/* Chest panel */}
      {c.fabricPattern === "panel" && (
        <path d="M76,70 L124,70 L124,128 L76,128 Z" fill={chest} opacity="0.4" />
      )}

      {/* Stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={62} y1={70} x2={62} y2={218} vertical={true} />
          {st.bothSides !== false && <StripeLines stripes={st} x1={138} y1={70} x2={138} y2={218} vertical={true} />}
        </>
      )}
      {st?.enabled && st.position === "chest" && (
        <StripeLines stripes={st} x1={76} y1={88} x2={124} y2={88} vertical={false} />
      )}
      {st?.enabled && st.position === "vertical-center" && (
        <StripeLines stripes={st} x1={76} y1={70} x2={124} y2={70} vertical={true} />
      )}

      {/* ── V-Collar ── */}
      <path d="M88,26 L100,50 L112,26 L108,22 L100,24 L92,22 Z" fill={collar} stroke={c.accentColor} strokeWidth="1" />
      {/* Collar band */}
      <path d="M88,26 Q100,20 112,26" fill="none" stroke={c.accentColor} strokeWidth="2" />

      {/* ── Logo ── */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="76" y="76" width="32" height="32" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "chest" && !c.logoUrl && (
        <rect x="78" y="78" width="28" height="28" rx="3" fill={c.accentColor} opacity="0.18"
          stroke={c.secondaryColor} strokeWidth="1" strokeDasharray="3,2" />
      )}
      {c.logoPosition === "sleeve" && c.logoUrl && (
        <image href={c.logoUrl} x="24" y="60" width="20" height="20" preserveAspectRatio="xMidYMid meet" />
      )}

      {/* ── Number ── */}
      {c.customNumber && (
        <text x="100" y="170" textAnchor="middle" fontSize="44" fontWeight="900"
          fill={c.secondaryColor} opacity="0.82" fontFamily="Arial Black, sans-serif"
          stroke={c.accentColor} strokeWidth="1">{c.customNumber.slice(0, 2)}</text>
      )}
      {/* ── Name ── */}
      {c.customText && (
        <text x="100" y="210" textAnchor="middle" fontSize="10" fontWeight="700"
          fill={c.secondaryColor} opacity="0.88" fontFamily="Arial, sans-serif"
          letterSpacing="2">{c.customText.slice(0, 12).toUpperCase()}</text>
      )}
    </svg>
  );
}

// ─── Shirt ────────────────────────────────────────────────────────────────────
function ShirtSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const collar = c.panels?.collarColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;
  const sidePnl = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Sleeves ── */}
      <path d="M58,35 L14,76 L22,92 L55,66 L55,114 L66,114 L66,38 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,35 L186,76 L178,92 L145,66 L145,114 L134,114 L134,38 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Sleeve panel */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M58,35 L38,54 L22,92 L55,66 L55,114 L60,114 L60,38 Z" fill={slvPnl} opacity="0.5" />
          <path d="M142,35 L162,54 L178,92 L145,66 L145,114 L140,114 L140,38 Z" fill={slvPnl} opacity="0.5" />
        </>
      )}

      {/* Cuffs */}
      <rect x="55" y="106" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="134" y="106" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />

      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (
        <>
          <StripeLines stripes={st} x1={22} y1={62} x2={55} y2={62} vertical={false} />
          <StripeLines stripes={st} x1={145} y1={62} x2={178} y2={62} vertical={false} />
        </>
      )}

      {/* ── Body ── */}
      <path d="M58,35 L55,66 L55,222 L145,222 L145,66 L142,35 L122,22 L100,28 L78,22 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panels */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M55,66 L68,66 L68,222 L55,222 Z" fill={sidePnl} opacity="0.55" />
          <path d="M145,66 L132,66 L132,222 L145,222 Z" fill={sidePnl} opacity="0.55" />
        </>
      )}

      {/* Button placket */}
      <line x1="100" y1="36" x2="100" y2="222" stroke={c.accentColor} strokeWidth="1.5" opacity="0.35" />
      {[60,82,104,126,148,170,192,214].map((y, i) => (
        <circle key={i} cx="100" cy={y} r="2" fill={c.secondaryColor} opacity="0.55" />
      ))}

      {/* Collar */}
      <path d="M78,28 L100,22 L122,28 L118,46 L100,38 L82,46 Z" fill={collar} stroke={c.accentColor} strokeWidth="1" />

      {/* Chest pocket */}
      <rect x="108" y="76" width="24" height="20" rx="2" fill={c.secondaryColor} opacity="0.1" stroke={c.secondaryColor} strokeWidth="1" />

      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={55} y1={66} x2={55} y2={222} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={145} y1={66} x2={145} y2={222} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <StripeLines stripes={st} x1={68} y1={66} x2={132} y2={66} vertical={true} />
      )}

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="76" width="28" height="28" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "sleeve" && c.logoUrl && (
        <image href={c.logoUrl} x="18" y="62" width="20" height="20" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customText && (
        <text x="100" y="214" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif"
          letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>
      )}
    </svg>
  );
}

// ─── Trouser ──────────────────────────────────────────────────────────────────
function TrouserSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const waist = c.panels?.collarColor ?? c.collarColor;

  return (
    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Waistband ── */}
      <rect x="38" y="20" width="124" height="22" rx="4" fill={waist} stroke={c.accentColor} strokeWidth="1.5" />
      {[54, 74, 100, 126, 146].map((x, i) => (
        <rect key={i} x={x} y="16" width="6" height="10" rx="1" fill={c.accentColor} opacity="0.7" />
      ))}
      {/* Drawstring */}
      <path d="M80,31 Q100,36 120,31" fill="none" stroke={c.secondaryColor} strokeWidth="1.5" opacity="0.6" />

      {/* ── Left leg ── */}
      <path d="M38,42 L38,200 Q38,244 60,244 L96,244 Q106,244 100,200 L100,42 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* ── Right leg ── */}
      <path d="M162,42 L162,200 Q162,244 140,244 L104,244 Q94,244 100,200 L100,42 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panel strips */}
      <path d="M38,42 L52,42 L52,240 Q45,242 38,200 Z" fill={panel} opacity="0.65" />
      <path d="M162,42 L148,42 L148,240 Q155,242 162,200 Z" fill={panel} opacity="0.65" />

      {/* Side stripes */}
      {st?.enabled && (st.position === "side" || st.position === "sleeve") && (
        <>
          <StripeLines stripes={st} x1={40} y1={42} x2={40} y2={240} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={160} y1={42} x2={160} y2={240} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <>
          <StripeLines stripes={st} x1={52} y1={42} x2={100} y2={42} vertical={true} />
          <StripeLines stripes={st} x1={100} y1={42} x2={148} y2={42} vertical={true} />
        </>
      )}

      {/* Crotch seam */}
      <path d="M38,42 Q100,84 162,42" fill="none" stroke={c.accentColor} strokeWidth="1.5" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="54" y="55" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customNumber && (
        <text x="100" y="158" textAnchor="middle" fontSize="32" fontWeight="900"
          fill={c.secondaryColor} opacity="0.4" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>
      )}
    </svg>
  );
}

// ─── Tracksuit ────────────────────────────────────────────────────────────────
function TracksuitSVG({ c }: { c: OutfitConfig }) {
  const id     = React.useId().replace(/:/g, "");
  const fill   = patternFill(id, c);
  const st     = c.stripes;
  const panel  = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const collar = c.panels?.collarColor ?? c.collarColor;
  const cuff   = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;

  return (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Jacket sleeves ── */}
      <path d="M58,30 L14,66 L22,84 L55,62 L55,124 L66,124 L66,33 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,30 L186,66 L178,84 L145,62 L145,124 L134,124 L134,33 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Sleeve panel */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M58,30 L36,50 L22,84 L55,62 L55,124 L60,124 L60,33 Z" fill={slvPnl} opacity="0.5" />
          <path d="M142,30 L164,50 L178,84 L145,62 L145,124 L140,124 L140,33 Z" fill={slvPnl} opacity="0.5" />
        </>
      )}

      {/* Cuffs */}
      <rect x="55" y="116" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="134" y="116" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />

      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (
        <>
          <StripeLines stripes={st} x1={22} y1={58} x2={55} y2={58} vertical={false} />
          <StripeLines stripes={st} x1={145} y1={58} x2={178} y2={58} vertical={false} />
        </>
      )}

      {/* ── Jacket body ── */}
      <path d="M58,30 L55,62 L55,148 L145,148 L145,62 L142,30 L122,20 L100,26 L78,20 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Jacket side panels */}
      <path d="M55,62 L68,62 L68,148 L55,148 Z" fill={panel} opacity="0.6" />
      <path d="M145,62 L132,62 L132,148 L145,148 Z" fill={panel} opacity="0.6" />

      {/* Chest panel */}
      {c.fabricPattern === "panel" && (
        <path d="M68,62 L132,62 L132,110 L68,110 Z" fill={panel} opacity="0.35" />
      )}

      {/* Jacket side stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={57} y1={62} x2={57} y2={148} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={143} y1={62} x2={143} y2={148} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <StripeLines stripes={st} x1={68} y1={62} x2={132} y2={62} vertical={true} />
      )}

      {/* Zip */}
      <line x1="100" y1="30" x2="100" y2="148" stroke={c.accentColor} strokeWidth="2" opacity="0.5" />
      {[40, 55, 70, 85, 100, 115, 130].map((y, i) => (
        <rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.4" />
      ))}

      {/* Collar */}
      <path d="M80,26 Q100,18 120,26 L116,43 Q100,35 84,43 Z" fill={collar} stroke={c.accentColor} strokeWidth="1" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="68" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "chest" && !c.logoUrl && (
        <rect x="70" y="70" width="22" height="22" rx="3" fill={c.accentColor} opacity="0.2" stroke={c.secondaryColor} strokeWidth="1" strokeDasharray="3,2" />
      )}
      {c.logoPosition === "sleeve" && c.logoUrl && (
        <image href={c.logoUrl} x="18" y="58" width="20" height="20" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customNumber && (
        <text x="100" y="124" textAnchor="middle" fontSize="22" fontWeight="900"
          fill={c.secondaryColor} opacity="0.7" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>
      )}
      {c.customText && (
        <text x="100" y="143" textAnchor="middle" fontSize="8" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif"
          letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>
      )}

      {/* ── Trouser waistband ── */}
      <rect x="44" y="151" width="112" height="16" rx="3" fill={collar} stroke={c.accentColor} strokeWidth="1" />

      {/* ── Left trouser leg ── */}
      <path d="M44,167 L44,258 Q44,274 62,274 L96,274 Q104,274 100,258 L100,167 Z" fill={c.primaryColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* ── Right trouser leg ── */}
      <path d="M156,167 L156,258 Q156,274 138,274 L104,274 Q96,274 100,258 L100,167 Z" fill={c.primaryColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Trouser side panels */}
      <path d="M44,167 L56,167 L56,270 Q50,272 44,258 Z" fill={panel} opacity="0.6" />
      <path d="M156,167 L144,167 L144,270 Q150,272 156,258 Z" fill={panel} opacity="0.6" />

      {/* Trouser side stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={46} y1={167} x2={46} y2={270} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={154} y1={167} x2={154} y2={270} vertical={true} />
          )}
        </>
      )}
    </svg>
  );
}

// ─── T-Shirt ──────────────────────────────────────────────────────────────────
function TShirtSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;

  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Sleeves ── */}
      <path d="M62,38 L14,72 L22,90 L58,68 L58,120 L68,120 L68,42 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M138,38 L186,72 L178,90 L142,68 L142,120 L132,120 L132,42 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Sleeve panel */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M62,38 L36,60 L22,90 L58,68 L58,120 L63,120 L63,42 Z" fill={slvPnl} opacity="0.5" />
          <path d="M138,38 L164,60 L178,90 L142,68 L142,120 L137,120 L137,42 Z" fill={slvPnl} opacity="0.5" />
        </>
      )}

      {/* Cuffs */}
      <rect x="58" y="112" width="10" height="9" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="132" y="112" width="10" height="9" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />

      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (
        <>
          <StripeLines stripes={st} x1={22} y1={68} x2={58} y2={68} vertical={false} />
          <StripeLines stripes={st} x1={142} y1={68} x2={178} y2={68} vertical={false} />
        </>
      )}

      {/* ── Body ── */}
      <path d="M62,38 L58,68 L58,200 L142,200 L142,68 L138,38 L118,28 L108,20 Q100,14 92,20 L82,28 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panels */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M58,68 L70,68 L70,200 L58,200 Z" fill={panel} opacity="0.6" />
          <path d="M142,68 L130,68 L130,200 L142,200 Z" fill={panel} opacity="0.6" />
          <path d="M70,68 L130,68 L130,118 L70,118 Z" fill={panel} opacity="0.3" />
        </>
      )}

      {/* Crew neck collar */}
      <path d="M82,28 Q100,42 118,28 Q110,20 100,18 Q90,20 82,28 Z" fill={c.panels?.collarColor ?? c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={60} y1={68} x2={60} y2={200} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={140} y1={68} x2={140} y2={200} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <StripeLines stripes={st} x1={70} y1={68} x2={130} y2={68} vertical={true} />
      )}

      {/* Chest stripe */}
      {st?.enabled && st.position === "chest" && (
        <StripeLines stripes={st} x1={70} y1={90} x2={130} y2={90} vertical={false} />
      )}

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="72" y="76" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "back" && c.logoUrl && (
        <image href={c.logoUrl} x="84" y="120" width="32" height="32" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "sleeve" && c.logoUrl && (
        <image href={c.logoUrl} x="18" y="66" width="20" height="20" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customText && (
        <text x="100" y="194" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif"
          letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>
      )}

      {c.customNumber && (
        <text x="100" y="160" textAnchor="middle" fontSize="40" fontWeight="900"
          fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>
      )}
    </svg>
  );
}

// ─── Hoodie ───────────────────────────────────────────────────────────────────
function HoodieSVG({ c }: { c: OutfitConfig }) {
  const id     = React.useId().replace(/:/g, "");
  const fill   = patternFill(id, c);
  const st     = c.stripes;
  const panel  = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff   = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const hood   = c.panels?.collarColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;

  return (
    <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Sleeves ── */}
      <path d="M58,40 L11,82 L20,100 L55,76 L55,134 L66,134 L66,43 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,40 L189,82 L180,100 L145,76 L145,134 L134,134 L134,43 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Sleeve panel */}
      {c.fabricPattern === "panel" && (
        <>
          <path d="M58,40 L34,62 L20,100 L55,76 L55,134 L60,134 L60,43 Z" fill={slvPnl} opacity="0.5" />
          <path d="M142,40 L166,62 L180,100 L145,76 L145,134 L140,134 L140,43 Z" fill={slvPnl} opacity="0.5" />
        </>
      )}

      {/* Cuffs */}
      <rect x="55" y="126" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="134" y="126" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />

      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (
        <>
          <StripeLines stripes={st} x1={20} y1={74} x2={55} y2={74} vertical={false} />
          <StripeLines stripes={st} x1={145} y1={74} x2={180} y2={74} vertical={false} />
        </>
      )}

      {/* ── Body ── */}
      <path d="M58,40 L55,76 L55,228 L145,228 L145,76 L142,40 L122,28 L110,22 L100,30 L90,22 L78,28 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panels */}
      <path d="M55,76 L68,76 L68,228 L55,228 Z" fill={panel} opacity="0.6" />
      <path d="M145,76 L132,76 L132,228 L145,228 Z" fill={panel} opacity="0.6" />

      {/* Chest panel */}
      {c.fabricPattern === "panel" && (
        <path d="M68,76 L132,76 L132,130 L68,130 Z" fill={panel} opacity="0.35" />
      )}

      {/* Hood */}
      <path d="M78,28 L70,10 Q100,-6 130,10 L122,28 L110,22 L100,30 L90,22 Z" fill={hood} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Hood inner shadow */}
      <path d="M84,26 L78,12 Q100,2 122,12 L116,26 Q100,18 84,26 Z" fill={c.accentColor} opacity="0.15" />

      {/* Kangaroo pocket */}
      <path d="M68,158 Q100,151 132,158 L132,188 Q100,195 68,188 Z" fill={c.secondaryColor} opacity="0.1" stroke={c.secondaryColor} strokeWidth="1" />

      {/* Zip */}
      <line x1="100" y1="32" x2="100" y2="158" stroke={c.accentColor} strokeWidth="1.5" opacity="0.4" />
      {[42, 56, 70, 84, 98, 112, 126, 140].map((y, i) => (
        <rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />
      ))}

      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (
        <>
          <StripeLines stripes={st} x1={57} y1={76} x2={57} y2={228} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={143} y1={76} x2={143} y2={228} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <StripeLines stripes={st} x1={68} y1={76} x2={132} y2={76} vertical={true} />
      )}

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="82" width="28" height="28" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "sleeve" && c.logoUrl && (
        <image href={c.logoUrl} x="16" y="74" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customText && (
        <text x="100" y="222" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif"
          letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>
      )}
    </svg>
  );
}

// ─── Shorts ───────────────────────────────────────────────────────────────────
function ShortsSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const waist = c.panels?.collarColor ?? c.collarColor;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />

      {/* ── Waistband ── */}
      <rect x="34" y="20" width="132" height="20" rx="4" fill={waist} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Drawstring */}
      <path d="M78,30 Q100,35 122,30" fill="none" stroke={c.secondaryColor} strokeWidth="1.5" opacity="0.6" />
      <circle cx="78" cy="30" r="3" fill={c.secondaryColor} opacity="0.55" />
      <circle cx="122" cy="30" r="3" fill={c.secondaryColor} opacity="0.55" />

      {/* ── Left leg ── */}
      <path d="M34,40 L34,148 Q34,168 56,168 L96,168 Q106,168 100,148 L100,40 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* ── Right leg ── */}
      <path d="M166,40 L166,148 Q166,168 144,168 L104,168 Q94,168 100,148 L100,40 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panels */}
      <path d="M34,40 L48,40 L48,164 Q41,166 34,148 Z" fill={panel} opacity="0.65" />
      <path d="M166,40 L152,40 L152,164 Q159,166 166,148 Z" fill={panel} opacity="0.65" />

      {/* Side stripes */}
      {st?.enabled && (st.position === "side" || st.position === "sleeve") && (
        <>
          <StripeLines stripes={st} x1={36} y1={40} x2={36} y2={164} vertical={true} />
          {(st.bothSides !== false) && (
            <StripeLines stripes={st} x1={164} y1={40} x2={164} y2={164} vertical={true} />
          )}
        </>
      )}

      {/* Vertical center */}
      {st?.enabled && st.position === "vertical-center" && (
        <>
          <StripeLines stripes={st} x1={48} y1={40} x2={100} y2={40} vertical={true} />
          <StripeLines stripes={st} x1={100} y1={40} x2={152} y2={40} vertical={true} />
        </>
      )}

      {/* Crotch seam */}
      <path d="M34,40 Q100,80 166,40" fill="none" stroke={c.accentColor} strokeWidth="1.5" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="50" y="52" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
      )}

      {c.customNumber && (
        <text x="100" y="124" textAnchor="middle" fontSize="34" fontWeight="900"
          fill={c.secondaryColor} opacity="0.4" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>
      )}
    </svg>
  );
}



// ─── Sweatshirt ───────────────────────────────────────────────────────────────
function SweatshirtSVG({ c }: { c: OutfitConfig }) {
  const id     = React.useId().replace(/:/g, "");
  const fill   = patternFill(id, c);
  const st     = c.stripes;
  const panel  = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff   = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves */}
      <path d="M60,42 L12,80 L22,98 L57,74 L57,130 L68,130 L68,46 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M140,42 L188,80 L178,98 L143,74 L143,130 L132,130 L132,46 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {c.fabricPattern === "panel" && (<><path d="M60,42 L36,64 L22,98 L57,74 L57,130 L62,130 L62,46 Z" fill={slvPnl} opacity="0.5" /><path d="M140,42 L164,64 L178,98 L143,74 L143,130 L138,130 L138,46 Z" fill={slvPnl} opacity="0.5" /></>)}
      {/* Cuffs */}
      <rect x="57" y="122" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="132" y="122" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {/* Sleeve stripes */}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (<><StripeLines stripes={st} x1={22} y1={72} x2={57} y2={72} vertical={false} /><StripeLines stripes={st} x1={143} y1={72} x2={178} y2={72} vertical={false} /></>)}
      {/* Body */}
      <path d="M60,42 L57,74 L57,220 L143,220 L143,74 L140,42 L120,30 L108,24 Q100,18 92,24 L80,30 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side panels */}
      {c.fabricPattern === "panel" && (<><path d="M57,74 L70,74 L70,220 L57,220 Z" fill={panel} opacity="0.6" /><path d="M143,74 L130,74 L130,220 L143,220 Z" fill={panel} opacity="0.6" /><path d="M70,74 L130,74 L130,124 L70,124 Z" fill={panel} opacity="0.3" /></>)}
      {/* Crew neck */}
      <path d="M80,30 Q100,44 120,30 Q112,22 100,20 Q88,22 80,30 Z" fill={c.panels?.collarColor ?? c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Kangaroo pocket */}
      <path d="M70,150 Q100,143 130,150 L130,178 Q100,185 70,178 Z" fill={c.secondaryColor} opacity="0.1" stroke={c.secondaryColor} strokeWidth="1" />
      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={59} y1={74} x2={59} y2={220} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={141} y1={74} x2={141} y2={220} vertical={true} />)}</>)}
      {st?.enabled && st.position === "vertical-center" && (<StripeLines stripes={st} x1={70} y1={74} x2={130} y2={74} vertical={true} />)}
      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="70" y="80" width="26" height="26" preserveAspectRatio="xMidYMid meet" />)}
      {c.logoPosition === "sleeve" && c.logoUrl && (<image href={c.logoUrl} x="18" y="70" width="20" height="20" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="214" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
      {c.customNumber && (<text x="100" y="170" textAnchor="middle" fontSize="40" fontWeight="900" fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Zip Hoodie ───────────────────────────────────────────────────────────────
function ZipHoodieSVG({ c }: { c: OutfitConfig }) {
  const id     = React.useId().replace(/:/g, "");
  const fill   = patternFill(id, c);
  const st     = c.stripes;
  const panel  = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff   = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const hood   = c.panels?.collarColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;
  return (
    <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves */}
      <path d="M58,40 L11,82 L20,100 L55,76 L55,134 L66,134 L66,43 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,40 L189,82 L180,100 L145,76 L145,134 L134,134 L134,43 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {c.fabricPattern === "panel" && (<><path d="M58,40 L34,62 L20,100 L55,76 L55,134 L60,134 L60,43 Z" fill={slvPnl} opacity="0.5" /><path d="M142,40 L166,62 L180,100 L145,76 L145,134 L140,134 L140,43 Z" fill={slvPnl} opacity="0.5" /></>)}
      {/* Cuffs */}
      <rect x="55" y="126" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="134" y="126" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (<><StripeLines stripes={st} x1={20} y1={74} x2={55} y2={74} vertical={false} /><StripeLines stripes={st} x1={145} y1={74} x2={180} y2={74} vertical={false} /></>)}
      {/* Body */}
      <path d="M58,40 L55,76 L55,228 L145,228 L145,76 L142,40 L122,28 L110,22 L100,30 L90,22 L78,28 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side panels */}
      <path d="M55,76 L68,76 L68,228 L55,228 Z" fill={panel} opacity="0.6" />
      <path d="M145,76 L132,76 L132,228 L145,228 Z" fill={panel} opacity="0.6" />
      {c.fabricPattern === "panel" && (<path d="M68,76 L132,76 L132,130 L68,130 Z" fill={panel} opacity="0.35" />)}
      {/* Hood */}
      <path d="M78,28 L70,10 Q100,-6 130,10 L122,28 L110,22 L100,30 L90,22 Z" fill={hood} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M84,26 L78,12 Q100,2 122,12 L116,26 Q100,18 84,26 Z" fill={c.accentColor} opacity="0.15" />
      {/* Full-length zip */}
      <line x1="100" y1="32" x2="100" y2="228" stroke={c.accentColor} strokeWidth="2" opacity="0.5" />
      {[42,56,70,84,98,112,126,140,154,168,182,196,210].map((y, i) => (
        <rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />
      ))}
      {/* Zip pull */}
      <rect x="97" y="32" width="6" height="8" rx="1" fill={c.accentColor} opacity="0.7" />
      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={57} y1={76} x2={57} y2={228} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={143} y1={76} x2={143} y2={228} vertical={true} />)}</>)}
      {st?.enabled && st.position === "vertical-center" && (<StripeLines stripes={st} x1={68} y1={76} x2={132} y2={76} vertical={true} />)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="68" y="82" width="24" height="24" preserveAspectRatio="xMidYMid meet" />)}
      {c.logoPosition === "sleeve" && c.logoUrl && (<image href={c.logoUrl} x="16" y="74" width="22" height="22" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="222" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
    </svg>
  );
}

// ─── Crop Hoodie ──────────────────────────────────────────────────────────────
function CropHoodieSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const hood  = c.panels?.collarColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves */}
      <path d="M60,42 L14,78 L23,96 L57,74 L57,128 L68,128 L68,46 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M140,42 L186,78 L177,96 L143,74 L143,128 L132,128 L132,46 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Cuffs */}
      <rect x="57" y="120" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="132" y="120" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (<><StripeLines stripes={st} x1={23} y1={72} x2={57} y2={72} vertical={false} /><StripeLines stripes={st} x1={143} y1={72} x2={177} y2={72} vertical={false} /></>)}
      {/* Body — cropped at ~175 */}
      <path d="M60,42 L57,74 L57,178 L143,178 L143,74 L140,42 L120,30 L108,22 L100,30 L92,22 L80,30 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Crop hem band */}
      <rect x="57" y="172" width="86" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {/* Side panels */}
      {c.fabricPattern === "panel" && (<><path d="M57,74 L68,74 L68,172 L57,172 Z" fill={panel} opacity="0.6" /><path d="M143,74 L132,74 L132,172 L143,172 Z" fill={panel} opacity="0.6" /></>)}
      {/* Hood */}
      <path d="M80,30 L72,12 Q100,-4 128,12 L120,30 L108,22 L100,30 L92,22 Z" fill={hood} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M86,28 L80,14 Q100,4 120,14 L114,28 Q100,20 86,28 Z" fill={c.accentColor} opacity="0.15" />
      {/* Zip */}
      <line x1="100" y1="32" x2="100" y2="172" stroke={c.accentColor} strokeWidth="1.5" opacity="0.4" />
      {[42,56,70,84,98,112,126,140,154].map((y, i) => (
        <rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />
      ))}
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={59} y1={74} x2={59} y2={172} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={141} y1={74} x2={141} y2={172} vertical={true} />)}</>)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="68" y="78" width="24" height="24" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="166" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
    </svg>
  );
}

// ─── Track Jacket ─────────────────────────────────────────────────────────────
function TrackJacketSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  const slvPnl = c.panels?.sleevePanel ?? c.sleeveColor;
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves */}
      <path d="M60,38 L12,76 L22,94 L57,70 L57,128 L68,128 L68,42 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M140,38 L188,76 L178,94 L143,70 L143,128 L132,128 L132,42 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {c.fabricPattern === "panel" && (<><path d="M60,38 L36,60 L22,94 L57,70 L57,128 L62,128 L62,42 Z" fill={slvPnl} opacity="0.5" /><path d="M140,38 L164,60 L178,94 L143,70 L143,128 L138,128 L138,42 Z" fill={slvPnl} opacity="0.5" /></>)}
      {/* Cuffs */}
      <rect x="57" y="120" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="132" y="120" width="11" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (<><StripeLines stripes={st} x1={22} y1={68} x2={57} y2={68} vertical={false} /><StripeLines stripes={st} x1={143} y1={68} x2={178} y2={68} vertical={false} /></>)}
      {/* Body */}
      <path d="M60,38 L57,70 L57,218 L143,218 L143,70 L140,38 L118,26 L108,20 L100,26 L92,20 L82,26 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side panels */}
      <path d="M57,70 L70,70 L70,218 L57,218 Z" fill={panel} opacity="0.6" />
      <path d="M143,70 L130,70 L130,218 L143,218 Z" fill={panel} opacity="0.6" />
      {/* Stand collar */}
      <path d="M82,26 L80,16 Q100,8 120,16 L118,26 L108,20 L100,26 L92,20 Z" fill={c.panels?.collarColor ?? c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Full zip */}
      <line x1="100" y1="28" x2="100" y2="218" stroke={c.accentColor} strokeWidth="2" opacity="0.5" />
      {[38,52,66,80,94,108,122,136,150,164,178,192,206].map((y, i) => (
        <rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />
      ))}
      <rect x="97" y="28" width="6" height="8" rx="1" fill={c.accentColor} opacity="0.7" />
      {/* Hem band */}
      <rect x="57" y="212" width="86" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={59} y1={70} x2={59} y2={212} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={141} y1={70} x2={141} y2={212} vertical={true} />)}</>)}
      {st?.enabled && st.position === "vertical-center" && (<StripeLines stripes={st} x1={70} y1={70} x2={130} y2={70} vertical={true} />)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="68" y="76" width="24" height="24" preserveAspectRatio="xMidYMid meet" />)}
      {c.logoPosition === "sleeve" && c.logoUrl && (<image href={c.logoUrl} x="18" y="66" width="20" height="20" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="208" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
      {c.customNumber && (<text x="100" y="168" textAnchor="middle" fontSize="38" fontWeight="900" fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Bomber ───────────────────────────────────────────────────────────────────
function BomberSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves — wider bomber style */}
      <path d="M58,46 L8,82 L18,102 L55,80 L55,132 L68,132 L68,50 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,46 L192,82 L182,102 L145,80 L145,132 L132,132 L132,50 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Ribbed cuffs */}
      <rect x="55" y="124" width="13" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1.5" />
      <rect x="132" y="124" width="13" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1.5" />
      {[126,128,130,132,134].map((y, i) => (<line key={i} x1="55" y1={y} x2="68" y2={y} stroke={c.accentColor} strokeWidth="0.5" opacity="0.4" />))}
      {[126,128,130,132,134].map((y, i) => (<line key={i} x1="132" y1={y} x2="145" y2={y} stroke={c.accentColor} strokeWidth="0.5" opacity="0.4" />))}
      {st?.enabled && (st.position === "sleeve" || st.position === "shoulder") && (<><StripeLines stripes={st} x1={18} y1={78} x2={55} y2={78} vertical={false} /><StripeLines stripes={st} x1={145} y1={78} x2={182} y2={78} vertical={false} /></>)}
      {/* Body */}
      <path d="M58,46 L55,80 L55,192 L145,192 L145,80 L142,46 Q120,32 100,34 Q80,32 58,46 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side panels */}
      {c.fabricPattern === "panel" && (<><path d="M55,80 L68,80 L68,192 L55,192 Z" fill={panel} opacity="0.6" /><path d="M145,80 L132,80 L132,192 L145,192 Z" fill={panel} opacity="0.6" /></>)}
      {/* Ribbed hem */}
      <rect x="55" y="186" width="90" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1.5" />
      {[188,190,192,194,196].map((y, i) => (<line key={i} x1="55" y1={y} x2="145" y2={y} stroke={c.accentColor} strokeWidth="0.5" opacity="0.4" />))}
      {/* Collar */}
      <path d="M80,44 Q100,36 120,44 L118,52 Q100,44 82,52 Z" fill={c.panels?.collarColor ?? c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Zip */}
      <line x1="100" y1="52" x2="100" y2="186" stroke={c.accentColor} strokeWidth="2" opacity="0.5" />
      {[58,72,86,100,114,128,142,156,170].map((y, i) => (<rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />))}
      <rect x="97" y="52" width="6" height="8" rx="1" fill={c.accentColor} opacity="0.7" />
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={57} y1={80} x2={57} y2={186} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={143} y1={80} x2={143} y2={186} vertical={true} />)}</>)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="68" y="84" width="26" height="26" preserveAspectRatio="xMidYMid meet" />)}
      {c.logoPosition === "sleeve" && c.logoUrl && (<image href={c.logoUrl} x="14" y="76" width="22" height="22" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="182" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
      {c.customNumber && (<text x="100" y="152" textAnchor="middle" fontSize="38" fontWeight="900" fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Puffer ───────────────────────────────────────────────────────────────────
function PufferSVG({ c }: { c: OutfitConfig }) {
  const id   = React.useId().replace(/:/g, "");
  const fill = patternFill(id, c);
  const st   = c.stripes;
  const cuff = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Sleeves */}
      <path d="M58,48 L8,86 L18,106 L55,84 L55,136 L68,136 L68,52 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      <path d="M142,48 L192,86 L182,106 L145,84 L145,136 L132,136 L132,52 Z" fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Sleeve quilting lines */}
      {[70,82,94,106,118].map((y, i) => (<path key={i} d={`M12,${y} Q33,${y-4} 55,${y}`} fill="none" stroke={c.accentColor} strokeWidth="0.8" opacity="0.3" />))}
      {[70,82,94,106,118].map((y, i) => (<path key={i} d={`M145,${y} Q167,${y-4} 188,${y}`} fill="none" stroke={c.accentColor} strokeWidth="0.8" opacity="0.3" />))}
      {/* Cuffs */}
      <rect x="55" y="128" width="13" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1.5" />
      <rect x="132" y="128" width="13" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Body */}
      <path d="M58,48 L55,84 L55,210 L145,210 L145,84 L142,48 Q120,36 100,38 Q80,36 58,48 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Body quilting lines */}
      {[96,112,128,144,160,176,192].map((y, i) => (<path key={i} d={`M55,${y} Q100,${y-5} 145,${y}`} fill="none" stroke={c.accentColor} strokeWidth="1" opacity="0.25" />))}
      {/* Collar */}
      <path d="M80,46 Q100,38 120,46 L118,56 Q100,48 82,56 Z" fill={c.panels?.collarColor ?? c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Zip */}
      <line x1="100" y1="56" x2="100" y2="210" stroke={c.accentColor} strokeWidth="2" opacity="0.5" />
      {[62,76,90,104,118,132,146,160,174,188,202].map((y, i) => (<rect key={i} x="98" y={y} width="4" height="3" rx="0.5" fill={c.accentColor} opacity="0.35" />))}
      <rect x="97" y="56" width="6" height="8" rx="1" fill={c.accentColor} opacity="0.7" />
      {/* Hem */}
      <rect x="55" y="204" width="90" height="10" rx="2" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={57} y1={84} x2={57} y2={204} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={143} y1={84} x2={143} y2={204} vertical={true} />)}</>)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="68" y="88" width="24" height="24" preserveAspectRatio="xMidYMid meet" />)}
      {c.customText && (<text x="100" y="200" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">{c.customText.slice(0, 14).toUpperCase()}</text>)}
    </svg>
  );
}

// ─── Sweatpants ───────────────────────────────────────────────────────────────
function SweatpantsSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const waist = c.panels?.collarColor ?? c.collarColor;
  const cuff  = c.panels?.cuffColor ?? c.cuffColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Waistband */}
      <rect x="34" y="20" width="132" height="22" rx="4" fill={waist} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Drawstring */}
      <path d="M76,31 Q100,37 124,31" fill="none" stroke={c.secondaryColor} strokeWidth="1.5" opacity="0.6" />
      <circle cx="76" cy="31" r="3" fill={c.secondaryColor} opacity="0.55" />
      <circle cx="124" cy="31" r="3" fill={c.secondaryColor} opacity="0.55" />
      {/* Left leg */}
      <path d="M34,42 L30,210 Q30,228 52,228 L96,228 Q108,228 100,210 L100,42 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right leg */}
      <path d="M166,42 L170,210 Q170,228 148,228 L104,228 Q92,228 100,210 L100,42 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side panels */}
      {c.fabricPattern === "panel" && (<><path d="M34,42 L48,42 L46,224 Q38,226 30,210 Z" fill={panel} opacity="0.55" /><path d="M166,42 L152,42 L154,224 Q162,226 170,210 Z" fill={panel} opacity="0.55" /></>)}
      {/* Ankle cuffs */}
      <rect x="30" y="220" width="66" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      <rect x="104" y="220" width="66" height="12" rx="3" fill={cuff} stroke={c.accentColor} strokeWidth="1" />
      {/* Crotch seam */}
      <path d="M34,42 Q100,82 166,42" fill="none" stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side stripes */}
      {st?.enabled && (st.position === "side" || st.position === "sleeve") && (<><StripeLines stripes={st} x1={36} y1={42} x2={32} y2={218} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={164} y1={42} x2={168} y2={218} vertical={true} />)}</>)}
      {c.logoPosition === "chest" && c.logoUrl && (<image href={c.logoUrl} x="50" y="54" width="22" height="22" preserveAspectRatio="xMidYMid meet" />)}
      {c.customNumber && (<text x="100" y="150" textAnchor="middle" fontSize="34" fontWeight="900" fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Cargo Pants ──────────────────────────────────────────────────────────────
function CargoPantsSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const waist = c.panels?.collarColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Waistband */}
      <rect x="32" y="18" width="136" height="20" rx="3" fill={waist} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Belt loops */}
      {[44,68,92,116,140,156].map((x, i) => (<rect key={i} x={x} y="14" width="6" height="10" rx="1" fill={c.accentColor} opacity="0.4" />))}
      {/* Left leg */}
      <path d="M32,38 L28,218 Q28,236 50,236 L96,236 Q108,236 100,218 L100,38 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right leg */}
      <path d="M168,38 L172,218 Q172,236 150,236 L104,236 Q92,236 100,218 L100,38 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Cargo pockets left */}
      <rect x="34" y="100" width="30" height="36" rx="3" fill={panel} opacity="0.5" stroke={c.accentColor} strokeWidth="1" />
      <line x1="34" y1="118" x2="64" y2="118" stroke={c.accentColor} strokeWidth="0.8" opacity="0.5" />
      <rect x="42" y="96" width="14" height="8" rx="2" fill={panel} opacity="0.7" stroke={c.accentColor} strokeWidth="0.8" />
      {/* Cargo pockets right */}
      <rect x="136" y="100" width="30" height="36" rx="3" fill={panel} opacity="0.5" stroke={c.accentColor} strokeWidth="1" />
      <line x1="136" y1="118" x2="166" y2="118" stroke={c.accentColor} strokeWidth="0.8" opacity="0.5" />
      <rect x="144" y="96" width="14" height="8" rx="2" fill={panel} opacity="0.7" stroke={c.accentColor} strokeWidth="0.8" />
      {/* Crotch seam */}
      <path d="M32,38 Q100,78 168,38" fill="none" stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side stripes */}
      {st?.enabled && st.position === "side" && (<><StripeLines stripes={st} x1={34} y1={38} x2={30} y2={232} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={166} y1={38} x2={170} y2={232} vertical={true} />)}</>)}
      {c.customNumber && (<text x="100" y="160" textAnchor="middle" fontSize="34" fontWeight="900" fill={c.secondaryColor} opacity="0.35" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Cargo Shorts ─────────────────────────────────────────────────────────────
function ShortsCargSVG({ c }: { c: OutfitConfig }) {
  const id    = React.useId().replace(/:/g, "");
  const fill  = patternFill(id, c);
  const st    = c.stripes;
  const panel = c.panels?.sidePanel ?? c.panelColor ?? c.secondaryColor;
  const waist = c.panels?.collarColor ?? c.collarColor;
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <PatternDefs id={id} c={c} />
      {/* Waistband */}
      <rect x="34" y="20" width="132" height="20" rx="4" fill={waist} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Drawstring */}
      <path d="M78,30 Q100,35 122,30" fill="none" stroke={c.secondaryColor} strokeWidth="1.5" opacity="0.6" />
      <circle cx="78" cy="30" r="3" fill={c.secondaryColor} opacity="0.55" />
      <circle cx="122" cy="30" r="3" fill={c.secondaryColor} opacity="0.55" />
      {/* Left leg */}
      <path d="M34,40 L34,148 Q34,168 56,168 L96,168 Q106,168 100,148 L100,40 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right leg */}
      <path d="M166,40 L166,148 Q166,168 144,168 L104,168 Q94,168 100,148 L100,40 Z" fill={fill} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Cargo pockets left */}
      <rect x="36" y="80" width="28" height="32" rx="3" fill={panel} opacity="0.5" stroke={c.accentColor} strokeWidth="1" />
      <line x1="36" y1="96" x2="64" y2="96" stroke={c.accentColor} strokeWidth="0.8" opacity="0.5" />
      <rect x="43" y="76" width="14" height="8" rx="2" fill={panel} opacity="0.7" stroke={c.accentColor} strokeWidth="0.8" />
      {/* Cargo pockets right */}
      <rect x="136" y="80" width="28" height="32" rx="3" fill={panel} opacity="0.5" stroke={c.accentColor} strokeWidth="1" />
      <line x1="136" y1="96" x2="164" y2="96" stroke={c.accentColor} strokeWidth="0.8" opacity="0.5" />
      <rect x="143" y="76" width="14" height="8" rx="2" fill={panel} opacity="0.7" stroke={c.accentColor} strokeWidth="0.8" />
      {/* Side panels */}
      <path d="M34,40 L48,40 L48,164 Q41,166 34,148 Z" fill={panel} opacity="0.5" />
      <path d="M166,40 L152,40 L152,164 Q159,166 166,148 Z" fill={panel} opacity="0.5" />
      {/* Crotch seam */}
      <path d="M34,40 Q100,80 166,40" fill="none" stroke={c.accentColor} strokeWidth="1.5" />
      {/* Side stripes */}
      {st?.enabled && (st.position === "side" || st.position === "sleeve") && (<><StripeLines stripes={st} x1={36} y1={40} x2={36} y2={164} vertical={true} />{(st.bothSides !== false) && (<StripeLines stripes={st} x1={164} y1={40} x2={164} y2={164} vertical={true} />)}</>)}
      {c.customNumber && (<text x="100" y="124" textAnchor="middle" fontSize="34" fontWeight="900" fill={c.secondaryColor} opacity="0.4" fontFamily="Arial Black, sans-serif">{c.customNumber.slice(0, 2)}</text>)}
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function OutfitPreview({ config, className = "" }: { config: OutfitConfig; className?: string }) {
  const map: Record<ProductTemplate, React.ReactNode> = {
    jersey:       <JerseySVG      c={config} />,
    shirt:        <ShirtSVG       c={config} />,
    trouser:      <TrouserSVG     c={config} />,
    tracksuit:    <TracksuitSVG   c={config} />,
    hoodie:       <HoodieSVG      c={config} />,
    shorts:       <ShortsSVG      c={config} />,
    tshirt:       <TShirtSVG      c={config} />,
    sweatshirt:   <SweatshirtSVG  c={config} />,
    "zip-hoodie": <ZipHoodieSVG   c={config} />,
    "crop-hoodie":<CropHoodieSVG  c={config} />,
    "track-jacket":<TrackJacketSVG c={config} />,
    bomber:       <BomberSVG      c={config} />,
    puffer:       <PufferSVG      c={config} />,
    sweatpants:   <SweatpantsSVG  c={config} />,
    "cargo-pants":<CargoPantsSVG  c={config} />,
    "shorts-cargo":<ShortsCargSVG c={config} />,
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {map[config.productTemplate]}
    </div>
  );
}
