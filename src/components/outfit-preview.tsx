"use client";

import React from "react";

export type ProductTemplate = "jersey" | "shirt" | "trouser" | "tracksuit" | "hoodie" | "shorts";
export type FabricPattern = "solid" | "stripes" | "gradient" | "camo";
export type LogoPosition = "chest" | "back" | "sleeve" | "none";

export interface OutfitConfig {
  productTemplate: ProductTemplate;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sleeveColor: string;
  collarColor: string;
  stripeColor: string;
  logoUrl?: string;
  logoPosition: LogoPosition;
  customText?: string;
  customNumber?: string;
  fabricPattern: FabricPattern;
}

interface OutfitPreviewProps {
  config: OutfitConfig;
  className?: string;
}

// ─── Jersey SVG ───────────────────────────────────────────────────────────────
function JerseySVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasStripes = c.fabricPattern === "stripes";
  const hasGradient = c.fabricPattern === "gradient";

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
        {hasStripes && (
          <pattern id={`stripe-${id}`} patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill={c.primaryColor} />
            <rect width="6" height="12" fill={c.stripeColor} opacity="0.5" />
          </pattern>
        )}
        <clipPath id={`body-clip-${id}`}>
          <path d="M55,30 L20,60 L30,80 L50,70 L50,220 L150,220 L150,70 L170,80 L180,60 L145,30 L125,20 L100,25 L75,20 Z" />
        </clipPath>
      </defs>

      {/* Left sleeve */}
      <path d="M55,30 L20,60 L30,80 L50,70 L50,100 L60,100 L60,40 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right sleeve */}
      <path d="M145,30 L180,60 L170,80 L150,70 L150,100 L140,100 L140,40 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Body fill */}
      <path d="M55,30 L50,70 L50,220 L150,220 L150,70 L145,30 L125,20 L100,25 L75,20 Z"
        fill={hasGradient ? `url(#grad-${id})` : hasStripes ? `url(#stripe-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side panels */}
      <path d="M50,80 L50,220 L65,220 L65,80 Z" fill={c.secondaryColor} opacity="0.6" />
      <path d="M150,80 L150,220 L135,220 L135,80 Z" fill={c.secondaryColor} opacity="0.6" />

      {/* Collar */}
      <path d="M80,25 Q100,15 120,25 L118,40 Q100,32 82,40 Z"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1" />

      {/* Stripe accent on sleeves */}
      <line x1="35" y1="55" x2="48" y2="68" stroke={c.stripeColor} strokeWidth="3" opacity="0.7" />
      <line x1="165" y1="55" x2="152" y2="68" stroke={c.stripeColor} strokeWidth="3" opacity="0.7" />

      {/* Logo area */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="82" y="80" width="36" height="36"
          clipPath={`url(#body-clip-${id})`} preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "chest" && !c.logoUrl && (
        <rect x="85" y="82" width="30" height="30" rx="4"
          fill={c.accentColor} opacity="0.3" stroke={c.secondaryColor} strokeWidth="1" strokeDasharray="3,2" />
      )}

      {/* Custom number */}
      {c.customNumber && (
        <text x="100" y="160" textAnchor="middle" fontSize="36" fontWeight="900"
          fill={c.secondaryColor} opacity="0.85" fontFamily="Arial, sans-serif"
          stroke={c.accentColor} strokeWidth="1">
          {c.customNumber.slice(0, 2)}
        </text>
      )}

      {/* Custom text (name on back — shown at bottom) */}
      {c.customText && (
        <text x="100" y="210" textAnchor="middle" fontSize="10" fontWeight="700"
          fill={c.secondaryColor} opacity="0.9" fontFamily="Arial, sans-serif"
          letterSpacing="2">
          {c.customText.slice(0, 12).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

// ─── Shirt SVG ────────────────────────────────────────────────────────────────
function ShirtSVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasGradient = c.fabricPattern === "gradient";
  const hasStripes = c.fabricPattern === "stripes";

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
        {hasStripes && (
          <pattern id={`stripe-${id}`} patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill={c.primaryColor} />
            <rect width="5" height="10" fill={c.stripeColor} opacity="0.4" />
          </pattern>
        )}
      </defs>

      {/* Left sleeve (long) */}
      <path d="M58,35 L15,75 L22,90 L55,65 L55,110 L65,110 L65,38 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right sleeve (long) */}
      <path d="M142,35 L185,75 L178,90 L145,65 L145,110 L135,110 L135,38 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Body */}
      <path d="M58,35 L55,65 L55,220 L145,220 L145,65 L142,35 L122,22 L100,28 L78,22 Z"
        fill={hasGradient ? `url(#grad-${id})` : hasStripes ? `url(#stripe-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Button placket */}
      <line x1="100" y1="35" x2="100" y2="220" stroke={c.accentColor} strokeWidth="1.5" opacity="0.5" />
      {[55, 75, 95, 115, 135, 155, 175, 195].map((y, i) => (
        <circle key={i} cx="100" cy={y} r="2" fill={c.secondaryColor} opacity="0.7" />
      ))}

      {/* Collar */}
      <path d="M78,28 L100,22 L122,28 L118,45 L100,38 L82,45 Z"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1" />

      {/* Chest pocket */}
      <rect x="108" y="75" width="25" height="20" rx="2"
        fill={c.secondaryColor} opacity="0.15" stroke={c.secondaryColor} strokeWidth="1" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="75" width="28" height="28" preserveAspectRatio="xMidYMid meet" />
      )}

      {/* Custom text */}
      {c.customText && (
        <text x="100" y="210" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">
          {c.customText.slice(0, 14).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

// ─── Trouser SVG ──────────────────────────────────────────────────────────────
function TrouserSVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasGradient = c.fabricPattern === "gradient";

  return (
    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
      </defs>

      {/* Waistband */}
      <rect x="40" y="20" width="120" height="22" rx="4"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Belt loops */}
      {[55, 75, 100, 125, 145].map((x, i) => (
        <rect key={i} x={x} y="16" width="6" height="10" rx="1"
          fill={c.accentColor} opacity="0.7" />
      ))}

      {/* Left leg */}
      <path d="M40,42 L40,200 Q40,240 60,240 L95,240 Q105,240 100,200 L100,42 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right leg */}
      <path d="M160,42 L160,200 Q160,240 140,240 L105,240 Q95,240 100,200 L100,42 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side stripes */}
      <line x1="42" y1="42" x2="42" y2="235" stroke={c.stripeColor} strokeWidth="4" opacity="0.5" />
      <line x1="158" y1="42" x2="158" y2="235" stroke={c.stripeColor} strokeWidth="4" opacity="0.5" />

      {/* Crotch seam */}
      <path d="M40,42 Q100,80 160,42" fill="none" stroke={c.accentColor} strokeWidth="1.5" />

      {/* Logo on hip */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="55" y="55" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
      )}

      {/* Custom number */}
      {c.customNumber && (
        <text x="100" y="150" textAnchor="middle" fontSize="28" fontWeight="900"
          fill={c.secondaryColor} opacity="0.5" fontFamily="Arial, sans-serif">
          {c.customNumber.slice(0, 2)}
        </text>
      )}
    </svg>
  );
}

// ─── Tracksuit SVG ────────────────────────────────────────────────────────────
function TracksuitSVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasGradient = c.fabricPattern === "gradient";

  return (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
      </defs>

      {/* Jacket left sleeve */}
      <path d="M58,30 L15,65 L22,82 L55,62 L55,120 L65,120 L65,33 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Jacket right sleeve */}
      <path d="M142,30 L185,65 L178,82 L145,62 L145,120 L135,120 L135,33 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Jacket body */}
      <path d="M58,30 L55,62 L55,145 L145,145 L145,62 L142,30 L122,20 L100,26 L78,20 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Zip line */}
      <line x1="100" y1="30" x2="100" y2="145" stroke={c.accentColor} strokeWidth="2" opacity="0.6" />

      {/* Collar */}
      <path d="M80,26 Q100,18 120,26 L116,42 Q100,35 84,42 Z"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1" />

      {/* Side stripes on jacket */}
      <line x1="57" y1="62" x2="57" y2="145" stroke={c.stripeColor} strokeWidth="5" opacity="0.5" />
      <line x1="143" y1="62" x2="143" y2="145" stroke={c.stripeColor} strokeWidth="5" opacity="0.5" />

      {/* Trouser waistband */}
      <rect x="45" y="148" width="110" height="16" rx="3"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1" />

      {/* Left trouser leg */}
      <path d="M45,164 L45,255 Q45,270 62,270 L95,270 Q103,270 100,255 L100,164 Z"
        fill={c.primaryColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right trouser leg */}
      <path d="M155,164 L155,255 Q155,270 138,270 L105,270 Q97,270 100,255 L100,164 Z"
        fill={c.primaryColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Trouser side stripes */}
      <line x1="47" y1="164" x2="47" y2="265" stroke={c.stripeColor} strokeWidth="4" opacity="0.5" />
      <line x1="153" y1="164" x2="153" y2="265" stroke={c.stripeColor} strokeWidth="4" opacity="0.5" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="68" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
      )}
      {c.logoPosition === "chest" && !c.logoUrl && (
        <rect x="70" y="70" width="22" height="22" rx="3"
          fill={c.accentColor} opacity="0.3" stroke={c.secondaryColor} strokeWidth="1" strokeDasharray="3,2" />
      )}

      {/* Custom number */}
      {c.customNumber && (
        <text x="100" y="120" textAnchor="middle" fontSize="22" fontWeight="900"
          fill={c.secondaryColor} opacity="0.7" fontFamily="Arial, sans-serif">
          {c.customNumber.slice(0, 2)}
        </text>
      )}

      {/* Custom text */}
      {c.customText && (
        <text x="100" y="140" textAnchor="middle" fontSize="8" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">
          {c.customText.slice(0, 14).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

// ─── Hoodie SVG ───────────────────────────────────────────────────────────────
function HoodieSVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasGradient = c.fabricPattern === "gradient";

  return (
    <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
      </defs>

      {/* Left sleeve */}
      <path d="M58,40 L12,80 L20,98 L55,75 L55,130 L65,130 L65,43 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right sleeve */}
      <path d="M142,40 L188,80 L180,98 L145,75 L145,130 L135,130 L135,43 Z"
        fill={c.sleeveColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Body */}
      <path d="M58,40 L55,75 L55,225 L145,225 L145,75 L142,40 L122,28 L110,22 L100,30 L90,22 L78,28 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Hood */}
      <path d="M78,28 L70,10 Q100,-5 130,10 L122,28 L110,22 L100,30 L90,22 Z"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />

      {/* Kangaroo pocket */}
      <path d="M68,155 Q100,148 132,155 L132,185 Q100,192 68,185 Z"
        fill={c.secondaryColor} opacity="0.15" stroke={c.secondaryColor} strokeWidth="1" />

      {/* Zip */}
      <line x1="100" y1="32" x2="100" y2="155" stroke={c.accentColor} strokeWidth="1.5" opacity="0.5" />

      {/* Side stripes */}
      <line x1="57" y1="75" x2="57" y2="225" stroke={c.stripeColor} strokeWidth="5" opacity="0.4" />
      <line x1="143" y1="75" x2="143" y2="225" stroke={c.stripeColor} strokeWidth="5" opacity="0.4" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="68" y="80" width="28" height="28" preserveAspectRatio="xMidYMid meet" />
      )}

      {/* Custom text */}
      {c.customText && (
        <text x="100" y="218" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={c.secondaryColor} opacity="0.8" fontFamily="Arial, sans-serif" letterSpacing="2">
          {c.customText.slice(0, 14).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

// ─── Shorts SVG ───────────────────────────────────────────────────────────────
function ShortsSVG({ c }: { c: OutfitConfig }) {
  const id = React.useId().replace(/:/g, "");
  const hasGradient = c.fabricPattern === "gradient";

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {hasGradient && (
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.primaryColor} />
            <stop offset="100%" stopColor={c.secondaryColor} />
          </linearGradient>
        )}
      </defs>

      {/* Waistband */}
      <rect x="35" y="20" width="130" height="20" rx="4"
        fill={c.collarColor} stroke={c.accentColor} strokeWidth="1.5" />
      {/* Drawstring */}
      <line x1="80" y1="30" x2="120" y2="30" stroke={c.secondaryColor} strokeWidth="2" opacity="0.6" />
      <circle cx="80" cy="30" r="3" fill={c.secondaryColor} opacity="0.6" />
      <circle cx="120" cy="30" r="3" fill={c.secondaryColor} opacity="0.6" />

      {/* Left leg */}
      <path d="M35,40 L35,145 Q35,165 55,165 L95,165 Q105,165 100,145 L100,40 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />
      {/* Right leg */}
      <path d="M165,40 L165,145 Q165,165 145,165 L105,165 Q95,165 100,145 L100,40 Z"
        fill={hasGradient ? `url(#grad-${id})` : c.primaryColor}
        stroke={c.accentColor} strokeWidth="1.5" />

      {/* Side stripes */}
      <line x1="37" y1="40" x2="37" y2="160" stroke={c.stripeColor} strokeWidth="5" opacity="0.5" />
      <line x1="163" y1="40" x2="163" y2="160" stroke={c.stripeColor} strokeWidth="5" opacity="0.5" />

      {/* Crotch seam */}
      <path d="M35,40 Q100,75 165,40" fill="none" stroke={c.accentColor} strokeWidth="1.5" />

      {/* Logo */}
      {c.logoPosition === "chest" && c.logoUrl && (
        <image href={c.logoUrl} x="50" y="50" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
      )}

      {/* Custom number */}
      {c.customNumber && (
        <text x="100" y="120" textAnchor="middle" fontSize="30" fontWeight="900"
          fill={c.secondaryColor} opacity="0.5" fontFamily="Arial, sans-serif">
          {c.customNumber.slice(0, 2)}
        </text>
      )}
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function OutfitPreview({ config, className = "" }: OutfitPreviewProps) {
  const svgMap: Record<ProductTemplate, React.ReactNode> = {
    jersey:    <JerseySVG c={config} />,
    shirt:     <ShirtSVG c={config} />,
    trouser:   <TrouserSVG c={config} />,
    tracksuit: <TracksuitSVG c={config} />,
    hoodie:    <HoodieSVG c={config} />,
    shorts:    <ShortsSVG c={config} />,
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {svgMap[config.productTemplate]}
    </div>
  );
}
