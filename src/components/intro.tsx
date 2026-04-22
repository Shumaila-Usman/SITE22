"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ─── Easing ───────────────────────────────────────────────────────────────────
const SLAM: [number, number, number, number] = [0.22, 1.2, 0.36, 1];
const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Logo image ──────────────────────────────────────────────────────────────
function LogoMark({ size = 80 }: { size?: number }) {
  return (
    <Image
      src="/logo-intro.png"
      alt="Megacore International"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  );
}

// ─── Counter that ticks up ────────────────────────────────────────────────────
function Counter({ target, duration }: { target: number; duration: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{val}</span>;
}

// ─── Main intro component ─────────────────────────────────────────────────────
export function Intro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "black" | "logo" | "text" | "sweep" | "split" | "done"
  >("black");

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setPhase("logo"),   300);   // logo slams in
    const t2 = setTimeout(() => setPhase("text"),   1100);  // text reveals
    const t3 = setTimeout(() => setPhase("sweep"),  2000);  // red sweep
    const t4 = setTimeout(() => setPhase("split"),  2700);  // screen splits
    const t5 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3600);

    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.01 }} // exit handled by split panels
        >
          {/* ── Noise grain ── */}
          <div className="noise-overlay opacity-[0.06]" />

          {/* ── Ambient red glow ── */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(239,68,68,0.18),transparent_70%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "logo" || phase === "text" || phase === "sweep" ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* ── Split panels — top and bottom halves that fly apart ── */}
          <AnimatePresence>
            {phase === "split" && (
              <>
                {/* Top half */}
                <motion.div
                  key="top"
                  className="absolute inset-x-0 top-0 z-10 bg-black"
                  style={{ height: "50%" }}
                  initial={{ y: 0 }}
                  animate={{ y: "-100%" }}
                  transition={{ duration: 0.85, ease: SLAM, delay: 0.05 }}
                />
                {/* Bottom half */}
                <motion.div
                  key="bottom"
                  className="absolute inset-x-0 bottom-0 z-10 bg-black"
                  style={{ height: "50%" }}
                  initial={{ y: 0 }}
                  animate={{ y: "100%" }}
                  transition={{ duration: 0.85, ease: SLAM, delay: 0.05 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ── Red horizontal sweep line ── */}
          <AnimatePresence>
            {phase === "sweep" && (
              <motion.div
                key="sweep"
                className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_40px_8px_rgba(239,68,68,0.6)]"
                initial={{ left: "-4px", opacity: 1 }}
                animate={{ left: "calc(100% + 4px)", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.6, 1] }}
              />
            )}
          </AnimatePresence>

          {/* ── Center content ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

            {/* Logo mark — slams in with scale overshoot */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={
                phase === "logo" || phase === "text" || phase === "sweep"
                  ? { scale: 1, opacity: 1, rotate: 0 }
                  : phase === "split"
                  ? { scale: 1.08, opacity: 1, rotate: 0 }
                  : { scale: 0, opacity: 0, rotate: -15 }
              }
              transition={{ duration: 0.55, ease: SLAM }}
            >
              <div className="relative">
                {/* Glow ring */}
                <motion.div
                  className="absolute -inset-4 rounded-full bg-red-500/20 blur-2xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <LogoMark size={96} />
              </div>
            </motion.div>

            {/* Brand name — letter by letter reveal */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "text" || phase === "sweep" || phase === "split" ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* MEGACORE */}
              <div className="flex overflow-hidden">
                {"MEGACORE".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={
                      phase === "text" || phase === "sweep" || phase === "split"
                        ? { y: "0%", opacity: 1 }
                        : { y: "110%", opacity: 0 }
                    }
                    transition={{ duration: 0.5, ease: SMOOTH, delay: i * 0.04 }}
                    className="text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase tracking-[0.15em] text-white"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* INTERNATIONAL */}
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={
                  phase === "text" || phase === "sweep" || phase === "split"
                    ? { opacity: 1, letterSpacing: "0.35em" }
                    : { opacity: 0, letterSpacing: "0.6em" }
                }
                transition={{ duration: 0.7, ease: SMOOTH, delay: 0.35 }}
                className="text-[clamp(0.6rem,1.5vw,0.9rem)] font-light uppercase text-zinc-400"
              >
                International
              </motion.span>

              {/* Tagline */}
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === "text" || phase === "sweep" || phase === "split"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.6, ease: SMOOTH, delay: 0.55 }}
                className="mt-2 text-[10px] uppercase tracking-[0.3em] text-red-400/80"
              >
                Sportswear Manufacturer &amp; Exporter
              </motion.span>
            </motion.div>

            {/* Loading counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "text" ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-4 flex items-center gap-3"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/60" />
              <span className="font-mono text-xs text-zinc-500">
                <Counter target={100} duration={0.85} />%
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/60" />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="h-[1px] w-48 overflow-hidden rounded-full bg-white/[0.06]"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "text" ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: "0%" }}
                animate={{ width: phase === "text" ? "100%" : "0%" }}
                transition={{ duration: 0.85, ease: "linear", delay: 0.1 }}
              />
            </motion.div>
          </div>

          {/* ── Corner accents ── */}
          {(phase === "logo" || phase === "text" || phase === "sweep") && (
            <>
              {[
                "top-6 left-6 border-t border-l",
                "top-6 right-6 border-t border-r",
                "bottom-6 left-6 border-b border-l",
                "bottom-6 right-6 border-b border-r",
              ].map((cls, i) => (
                <motion.div
                  key={i}
                  className={`absolute h-8 w-8 border-red-500/40 ${cls}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: SMOOTH, delay: 0.2 + i * 0.05 }}
                />
              ))}
            </>
          )}

          {/* ── Bottom label ── */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "text" || phase === "sweep" ? 0.4 : 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
