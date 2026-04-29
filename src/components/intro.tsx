"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const SLAM: [number, number, number, number]   = [0.22, 1.2, 0.36, 1];
const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── 7 clothing images ────────────────────────────────────────────────────────
const CLOTH_IMAGES = [
  "/images/clothes/cloth-1.png",
  "/images/clothes/cloth-2.png",
  "/images/clothes/cloth-3.png",
  "/images/clothes/cloth-4.png",
  "/images/clothes/cloth-5.png",
  "/images/clothes/cloth-6.png",
  "/images/clothes/cloth-7.png",
];

// ─── Piece config ─────────────────────────────────────────────────────────────
// 7 pieces — each flies in from a different edge, then settles into a clean row.
// arrangeX is evenly spaced: -54vw, -36vw, -18vw, 0vw, 18vw, 36vw, 54vw
// All upright (arrangeR ≈ 0), large size, bottom-anchored so they look displayed.
const DESKTOP_PIECES = [
  { startX: "-70vw", startY: "-50vh", entryR: -45, arrangeX: "-54vw", arrangeY:  "8vh", arrangeR:  -4, delay: 0.00 },
  { startX:  "70vw", startY: "-50vh", entryR:  40, arrangeX: "-36vw", arrangeY:  "8vh", arrangeR:   3, delay: 0.06 },
  { startX: "-70vw", startY:  "50vh", entryR:  30, arrangeX: "-18vw", arrangeY:  "8vh", arrangeR:  -2, delay: 0.03 },
  { startX:   "0vw", startY: "-70vh", entryR:  10, arrangeX:   "0vw", arrangeY:  "8vh", arrangeR:   0, delay: 0.09 },
  { startX:  "70vw", startY:  "50vh", entryR: -35, arrangeX:  "18vw", arrangeY:  "8vh", arrangeR:   2, delay: 0.04 },
  { startX: "-40vw", startY:  "70vh", entryR:  20, arrangeX:  "36vw", arrangeY:  "8vh", arrangeR:  -3, delay: 0.07 },
  { startX:  "70vw", startY:   "0vh", entryR: -25, arrangeX:  "54vw", arrangeY:  "8vh", arrangeR:   4, delay: 0.02 },
];

// Mobile fly-in (unchanged); final positions are computed from viewport so garments can be large without clipping.
const MOBILE_FLY_IN = [
  { startX: "-80vw", startY: "-50vh", entryR: -45, delay: 0.0 },
  { startX: "80vw", startY: "-48vh", entryR: 40, delay: 0.06 },
  { startX: "-78vw", startY: "52vh", entryR: 30, delay: 0.03 },
  { startX: "0vw", startY: "-72vh", entryR: 10, delay: 0.09 },
  { startX: "78vw", startY: "52vh", entryR: -35, delay: 0.04 },
  { startX: "-52vw", startY: "72vh", entryR: 20, delay: 0.07 },
  { startX: "80vw", startY: "2vh", entryR: -25, delay: 0.02 },
] as const;

function buildMobilePieces(w: number) {
  const width = Math.max(280, Math.min(w, 520));
  /** Scale with viewport; slightly larger tiles, tight gap so 4+3 still fits */
  const arrangedSize = Math.round(Math.min(104, Math.max(76, width * 0.236)));
  const pieceVw = (arrangedSize / width) * 100;
  const gapVw = pieceVw * 1.04;
  const row1x = (i: number) => `${((i - 1.5) * gapVw).toFixed(1)}vw`;
  const row2x = (i: number) => `${((i - 1) * gapVw).toFixed(1)}vw`;
  const flyingSize = Math.round(Math.min(150, arrangedSize * 1.46));

  const arrangeR = [-2, 2, -1, 0, 2, -1, 1] as const;
  return {
    arrangedSize,
    flyingSize,
    pieces: MOBILE_FLY_IN.map((p, i) => ({
      startX: p.startX,
      startY: p.startY,
      entryR: p.entryR,
      delay: p.delay,
      arrangeR: arrangeR[i] ?? 0,
      arrangeY: i < 4 ? "-4vh" : "8vh",
      arrangeX: i < 4 ? row1x(i) : row2x(i - 4),
    })),
  };
}

// ─── Shockwave ────────────────────────────────────────────────────────────────
function Shockwave({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <>
          {[0, 0.25].map((delay, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/40"
              initial={{ width: 0, height: 0, opacity: 0.7 }}
              animate={{ width: "200vmax", height: "200vmax", opacity: 0 }}
              transition={{ duration: 2.0, ease: [0.2, 0, 0.8, 1], delay }}
            />
          ))}
          {/* Flash */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Single cloth piece ───────────────────────────────────────────────────────
interface PieceProps {
  src: string;
  startX: string; startY: string; entryR: number;
  arrangeX: string; arrangeY: string; arrangeR: number;
  delay: number;
  flyingSize: number;
  arrangedSize: number;
  phase: "hidden" | "flying" | "arranged" | "fadeout";
  index: number;
}

function ClothPiece({
  src, startX, startY, entryR,
  arrangeX, arrangeY, arrangeR,
  delay, phase, index, flyingSize, arrangedSize,
}: PieceProps) {
  const isFlying   = phase === "flying";
  const isArranged = phase === "arranged";
  const isFadeout  = phase === "fadeout";

  // Subtle float per piece
  const floatY   = 6 + (index % 3) * 2;
  const floatDur = 2.8 + (index % 4) * 0.4;

  const size = isArranged || isFadeout ? arrangedSize : flyingSize;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: "50%", top: "50%",
        marginLeft: -size / 2,
        marginTop:  -size / 2,
        width:  size,
        height: size,
        zIndex: 15 + index,
      }}
      initial={{ x: startX, y: startY, rotate: entryR * 2, opacity: 0, scale: 0.5 }}
      animate={
        isFadeout
          ? { opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }
          : isArranged
          ? {
              x: arrangeX, y: arrangeY,
              rotate: arrangeR,
              opacity: 1,
              scale: 1,
              transition: { duration: 1.6, ease: SLAM, delay: delay * 2 },
            }
          : isFlying
          ? {
              x: 0, y: 0, rotate: 0,
              opacity: 1, scale: 1,
              transition: { duration: 2.8, ease: [0.55, 0, 0.1, 1], delay: delay * 3 },
            }
          : { x: startX, y: startY, rotate: entryR * 2, opacity: 0, scale: 0.5 }
      }
    >
      {/* Gentle float wrapper */}
      <motion.div
        className="relative h-full w-full"
        animate={
          isArranged
            ? { y: [0, -floatY, 0] }
            : { y: 0 }
        }
        transition={{
          duration: floatDur,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          delay: index * 0.2,
        }}
      >
        <Image
          src={src} alt="" fill
          className="object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <Image src="/logo-intro.png" alt="Megacore International"
      width={80} height={80} className="object-contain" priority />
  );
}

// ─── Main intro ───────────────────────────────────────────────────────────────
// Timeline (~10s):
//  0.0s  black
//  0.4s  clothes fly in                  (fly)
//  2.0s  collision flash                 (collide)
//  2.5s  clothes arrange into row        (arrange)
//  3.6s  brand overlay fades in          (brand)
//  7.8s  everything fades out            (fadeout)
// 10.0s  done

export function Intro({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<
    "black" | "fly" | "collide" | "arrange" | "brand" | "fadeout" | "done"
  >("black");
  const [isMobile, setIsMobile] = useState(false);
  const [viewportW, setViewportW] = useState(390);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setViewportW(vw);
      setIsMobile(vw < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const mobileLayout = buildMobilePieces(viewportW);
  const pieces = isMobile ? mobileLayout.pieces : DESKTOP_PIECES;
  const arrangedSize = isMobile ? mobileLayout.arrangedSize : 280;
  const flyingSize = isMobile ? mobileLayout.flyingSize : 160;

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("fly"),     500),   // start flying
      setTimeout(() => setPhase("collide"), 3800),  // collision (fly-in takes ~3s)
      setTimeout(() => setPhase("arrange"), 4600),  // spread after collision
      setTimeout(() => setPhase("brand"),   6400),  // brand appears after spread settles
      setTimeout(() => setPhase("fadeout"), 11000), // hold brand then fade
      setTimeout(() => { setPhase("done"); onComplete(); }, 13000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const piecePhase: PieceProps["phase"] =
    phase === "fly" || phase === "collide" ? "flying"
    : phase === "arrange" || phase === "brand" ? "arranged"
    : phase === "fadeout" ? "fadeout"
    : "hidden";

  const showBrand = phase === "brand";
  const shockwave = phase === "collide";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: phase === "fadeout" ? 0.3 : 0 }}
        >
          {/* Noise */}
          <div className="noise-overlay opacity-[0.04]" />

          {/* Subtle red glow at center */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(239,68,68,0.12), transparent 70%)" }}
            animate={{ opacity: phase === "arrange" || phase === "brand" ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />

          {/* ── Cloth pieces ── */}
          {pieces.map((p, i) => (
            <ClothPiece
              key={i}
              src={CLOTH_IMAGES[i]}
              startX={p.startX}     startY={p.startY}     entryR={p.entryR}
              arrangeX={p.arrangeX} arrangeY={p.arrangeY} arrangeR={p.arrangeR}
              delay={p.delay}
              flyingSize={flyingSize}
              arrangedSize={arrangedSize}
              phase={piecePhase}
              index={i}
            />
          ))}

          {/* ── Shockwave ── */}
          <Shockwave trigger={shockwave} />

          {/* ── Brand overlay — minimal, centered ── */}
          <AnimatePresence>
            {showBrand && (
              <motion.div
                key="brand"
                className="absolute inset-0 z-[40] flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: SMOOTH }}
              >
                {/* Dark pill behind text so it reads over clothes */}
                <motion.div
                  className="flex flex-col items-center gap-2 rounded-xl px-5 py-5 sm:gap-3 sm:rounded-2xl sm:px-10 sm:py-8"
                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: SLAM }}
                >
                  <LogoMark />

                  <div className="flex overflow-hidden">
                    {"MEGACORE".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ duration: 0.55, ease: SMOOTH, delay: i * 0.05 }}
                        className="text-[clamp(1.25rem,7vw,3.8rem)] font-black uppercase tracking-[0.14em] text-white sm:tracking-[0.18em]"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: SMOOTH, delay: 0.5 }}
                    className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px] sm:tracking-[0.3em]"
                  >
                    {t("intro.tagline")}
                  </motion.span>

                  {/* Thin red line */}
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: SMOOTH, delay: 0.6 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
