"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SLAM: [number, number, number, number]   = [0.22, 1.2, 0.36, 1];
const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Clothing images ──────────────────────────────────────────────────────────
const CLOTH_IMAGES = [
  "/images/clothes/cloth-1.png",
  "/images/clothes/cloth-2.png",
  "/images/clothes/cloth-3.png",
  "/images/clothes/cloth-4.png",
  "/images/clothes/cloth-5.png",
  "/images/clothes/cloth-6.png",
  "/images/clothes/cloth-7.png",
  "/images/clothes/cloth-8.png",
  "/images/clothes/cloth-9.png",
  "/images/clothes/cloth-10.png",
  "/images/clothes/cloth-11.png",
];

// ─── Piece config ─────────────────────────────────────────────────────────────
// startX/Y  : off-screen launch position (relative to viewport center via translate)
// arrangeX/Y: where the piece settles after collision (spread around center)
// arrangeR  : final rotation when arranged
const PIECES = [
  // entry positions (from all edges)         // arranged positions (arc around center)
  { startX: "-55vw", startY: "-40vh", entryR: -40, arrangeX: "-38vw", arrangeY: "-22vh", arrangeR: -12, size: 155, delay: 0.00 },
  { startX:  "55vw", startY: "-40vh", entryR:  35, arrangeX:  "38vw", arrangeY: "-22vh", arrangeR:  12, size: 145, delay: 0.07 },
  { startX: "-55vw", startY:  "40vh", entryR:  25, arrangeX: "-38vw", arrangeY:  "22vh", arrangeR:   8, size: 150, delay: 0.04 },
  { startX:  "55vw", startY:  "40vh", entryR: -30, arrangeX:  "38vw", arrangeY:  "22vh", arrangeR: -10, size: 140, delay: 0.10 },
  { startX:   "0vw", startY: "-55vh", entryR:  15, arrangeX: "-18vw", arrangeY: "-30vh", arrangeR:   5, size: 148, delay: 0.03 },
  { startX:   "0vw", startY:  "55vh", entryR: -18, arrangeX:  "18vw", arrangeY:  "30vh", arrangeR:  -6, size: 152, delay: 0.08 },
  { startX: "-60vw", startY:   "0vh", entryR:  20, arrangeX: "-42vw", arrangeY:   "0vh", arrangeR:  15, size: 138, delay: 0.05 },
  { startX:  "60vw", startY:   "0vh", entryR: -22, arrangeX:  "42vw", arrangeY:   "0vh", arrangeR: -15, size: 142, delay: 0.06 },
  { startX: "-30vw", startY: "-55vh", entryR: -28, arrangeX:  "-8vw", arrangeY: "-32vh", arrangeR:  -4, size: 135, delay: 0.02 },
  { startX:  "30vw", startY:  "55vh", entryR:  22, arrangeX:   "8vw", arrangeY:  "32vh", arrangeR:   4, size: 145, delay: 0.09 },
  { startX:  "50vw", startY: "-30vh", entryR: -35, arrangeX:  "28vw", arrangeY: "-28vh", arrangeR:  -8, size: 132, delay: 0.01 },
];

// ─── Shockwave ────────────────────────────────────────────────────────────────
function Shockwave({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <>
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/50"
              initial={{ width: 0, height: 0, opacity: 0.85 }}
              animate={{ width: "220vmax", height: "220vmax", opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.2, 0, 0.8, 1], delay }}
            />
          ))}
          {/* White flash */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Red burst */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(239,68,68,0.6) 0%, transparent 70%)" }}
            initial={{ opacity: 1, scale: 0.3 }}
            animate={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.8, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Debris ───────────────────────────────────────────────────────────────────
function Debris({ trigger }: { trigger: boolean }) {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * 360,
    dist:  100 + (i % 5) * 50,
    size:  2 + (i % 4) * 2,
    delay: (i % 6) * 0.02,
  }));
  return (
    <AnimatePresence>
      {trigger && particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-red-400"
            style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos(rad) * p.dist, y: Math.sin(rad) * p.dist, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: p.delay }}
          />
        );
      })}
    </AnimatePresence>
  );
}

// ─── Single cloth piece ───────────────────────────────────────────────────────
interface PieceProps {
  src: string;
  startX: string; startY: string; entryR: number;
  arrangeX: string; arrangeY: string; arrangeR: number;
  size: number; delay: number;
  phase: "hidden" | "flying" | "arranged" | "fadeout";
  index: number;
}

function ClothPiece({ src, startX, startY, entryR, arrangeX, arrangeY, arrangeR, size, delay, phase, index }: PieceProps) {
  // Per-piece gentle float offsets
  const floatX   = ((index % 3) - 1) * 6;
  const floatY   = ((index % 2) === 0 ? 1 : -1) * 5;
  const floatR   = ((index % 2) === 0 ? 1 : -1) * 3;
  const floatDur = 2.2 + (index % 5) * 0.3;

  const isFlying   = phase === "flying";
  const isArranged = phase === "arranged";
  const isFadeout  = phase === "fadeout";

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: "50%", top: "50%",
        marginLeft: -size / 2, marginTop: -size / 2,
        width: size, height: size,
        zIndex: 15 + index,
      }}
      // Start off-screen
      initial={{ x: startX, y: startY, rotate: entryR * 2, opacity: 0, scale: 0.6 }}
      animate={
        isFadeout
          ? { opacity: 0, scale: 0.8, transition: { duration: 1.2, ease: "easeInOut" } }
          : isArranged
          ? {
              x: arrangeX, y: arrangeY, rotate: arrangeR,
              opacity: 0.92, scale: 1,
              transition: { duration: 1.0, ease: SLAM, delay: delay * 0.5 },
            }
          : isFlying
          ? {
              x: 0, y: 0, rotate: 0,
              opacity: 1, scale: 1,
              transition: { duration: 1.4, ease: [0.55, 0, 0.1, 1], delay },
            }
          : { x: startX, y: startY, rotate: entryR * 2, opacity: 0, scale: 0.6 }
      }
    >
      {/* Continuous float after arranged */}
      <motion.div
        className="relative h-full w-full"
        animate={
          isArranged
            ? {
                x: [0, floatX, -floatX * 0.5, floatX * 0.3, 0],
                y: [0, floatY, -floatY * 0.6, floatY * 0.2, 0],
                rotate: [0, floatR, -floatR * 0.4, floatR * 0.2, 0],
              }
            : {}
        }
        transition={{
          duration: floatDur,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          delay: delay * 0.5 + 1.0,
        }}
      >
        {/* Red glow behind each piece */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: "rgba(239,68,68,0.2)", transform: "scale(1.4)" }}
          animate={isArranged ? { opacity: [0.2, 0.5, 0.2] } : isFlying ? { opacity: 0.4 } : { opacity: 0 }}
          transition={isArranged ? { duration: floatDur, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        />
        <Image
          src={src} alt="" fill
          className="object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.45)]"
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoMark({ size = 96 }: { size?: number }) {
  return (
    <Image src="/logo-intro.png" alt="Megacore International"
      width={size} height={size} className="object-contain" priority />
  );
}

function Counter({ target, duration }: { target: number; duration: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{val}</span>;
}

// ─── Main intro ───────────────────────────────────────────────────────────────
// ── Timeline (~10 seconds) ────────────────────────────────────────────────────
//  0.0s  black
//  0.4s  clothes fly in toward center          (phase: fly)
//  2.2s  collision — shockwave + flash         (phase: collide)
//  2.7s  clothes spread/arrange around center  (phase: arrange)
//  3.8s  logo + brand text appear              (phase: brand)
//  7.5s  red sweep line                        (phase: sweep)
//  8.4s  clothes fade, split panels open       (phase: split)
// 10.0s  done

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "black" | "fly" | "collide" | "arrange" | "brand" | "sweep" | "split" | "done"
  >("black");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("fly"),     400),
      setTimeout(() => setPhase("collide"), 2200),
      setTimeout(() => setPhase("arrange"), 2700),
      setTimeout(() => setPhase("brand"),   3800),
      setTimeout(() => setPhase("sweep"),   7500),
      setTimeout(() => setPhase("split"),   8400),
      setTimeout(() => { setPhase("done"); onComplete(); }, 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const piecePhase: PieceProps["phase"] =
    phase === "fly" || phase === "collide" ? "flying"
    : phase === "arrange" || phase === "brand" || phase === "sweep" ? "arranged"
    : phase === "split" ? "fadeout"
    : "hidden";

  const showBrand   = phase === "brand" || phase === "sweep" || phase === "split";
  const shockwave   = phase === "collide" || phase === "arrange";
  const ambientHigh = phase === "collide" || phase === "arrange" || phase === "brand" || phase === "sweep";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.01 }}
        >
          {/* Noise */}
          <div className="noise-overlay opacity-[0.06]" />

          {/* Ambient red glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(239,68,68,0.2), transparent 70%)" }}
            animate={{ opacity: ambientHigh ? 1 : phase === "fly" ? 0.4 : 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* ── Cloth pieces ── */}
          {PIECES.map((p, i) => (
            <ClothPiece
              key={i}
              src={CLOTH_IMAGES[i % CLOTH_IMAGES.length]}
              startX={p.startX}   startY={p.startY}   entryR={p.entryR}
              arrangeX={p.arrangeX} arrangeY={p.arrangeY} arrangeR={p.arrangeR}
              size={p.size}       delay={p.delay}
              phase={piecePhase}
              index={i}
            />
          ))}

          {/* ── Shockwave ── */}
          <Shockwave trigger={shockwave} />

          {/* ── Debris ── */}
          <Debris trigger={phase === "collide"} />

          {/* ── Split panels ── */}
          <AnimatePresence>
            {phase === "split" && (
              <>
                <motion.div key="top"
                  className="absolute inset-x-0 top-0 z-30 bg-black" style={{ height: "50%" }}
                  initial={{ y: 0 }} animate={{ y: "-100%" }}
                  transition={{ duration: 1.0, ease: SLAM, delay: 0.1 }}
                />
                <motion.div key="bottom"
                  className="absolute inset-x-0 bottom-0 z-30 bg-black" style={{ height: "50%" }}
                  initial={{ y: 0 }} animate={{ y: "100%" }}
                  transition={{ duration: 1.0, ease: SLAM, delay: 0.1 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ── Red sweep line ── */}
          <AnimatePresence>
            {phase === "sweep" && (
              <motion.div key="sweep"
                className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_40px_8px_rgba(239,68,68,0.6)]"
                initial={{ left: "-4px", opacity: 1 }}
                animate={{ left: "calc(100% + 4px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.6, 1] }}
              />
            )}
          </AnimatePresence>

          {/* ── Center content (above clothes) ── */}
          <div className="absolute inset-0 z-[40] flex flex-col items-center justify-center gap-6">

            {/* Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={showBrand ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -15 }}
              transition={{ duration: 0.7, ease: SLAM }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-6 rounded-full bg-red-500/25 blur-3xl"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                />
                <LogoMark size={110} />
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: showBrand ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex overflow-hidden">
                {"MEGACORE".split("").map((char, i) => (
                  <motion.span key={i}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={showBrand ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: SMOOTH, delay: i * 0.055 }}
                    className="text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase tracking-[0.15em] text-white"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={showBrand ? { opacity: 1, letterSpacing: "0.35em" } : { opacity: 0, letterSpacing: "0.6em" }}
                transition={{ duration: 0.9, ease: SMOOTH, delay: 0.45 }}
                className="text-[clamp(0.6rem,1.5vw,0.9rem)] font-light uppercase text-zinc-400"
              >
                International
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={showBrand ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.7, ease: SMOOTH, delay: 0.65 }}
                className="mt-2 text-[10px] uppercase tracking-[0.3em] text-red-400/80"
              >
                Sportswear Manufacturer &amp; Exporter
              </motion.span>
            </motion.div>

            {/* Counter + progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "brand" ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-2 flex items-center gap-3"
            >
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-red-500/60" />
              <span className="font-mono text-xs text-zinc-500">
                <Counter target={100} duration={1.4} />%
              </span>
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-red-500/60" />
            </motion.div>

            <motion.div
              className="h-[1px] w-56 overflow-hidden rounded-full bg-white/[0.06]"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "brand" ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: "0%" }}
                animate={{ width: phase === "brand" ? "100%" : "0%" }}
                transition={{ duration: 1.4, ease: "linear", delay: 0.15 }}
              />
            </motion.div>
          </div>

          {/* Corner accents */}
          {showBrand && (
            <>
              {[
                "top-6 left-6 border-t border-l",
                "top-6 right-6 border-t border-r",
                "bottom-6 left-6 border-b border-l",
                "bottom-6 right-6 border-b border-r",
              ].map((cls, i) => (
                <motion.div key={i}
                  className={`absolute z-[40] h-8 w-8 border-red-500/40 ${cls}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: SMOOTH, delay: 0.3 + i * 0.06 }}
                />
              ))}
            </>
          )}

          {/* Bottom label */}
          <motion.div
            className="absolute bottom-6 left-1/2 z-[40] -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: showBrand ? 0.4 : 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              Pakistan · Est. Manufacturing Hub
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
