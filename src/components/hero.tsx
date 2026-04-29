"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Package,
  ShieldCheck,
  Zap,
  Factory,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const E_IN: [number, number, number, number] = [0.4, 0, 1, 1];

// ─── Clothing images background ──────────────────────────────────────────────

const BG_CLOTHES = [
  { src: "/images/clothes/cloth-1.png",  left: "4%",  top: "8%",  size: 130, rot: -15, opacity: 0.18, floatY: 18, floatDur: 8,  delay: 0    },
  { src: "/images/clothes/cloth-2.png",  left: "80%", top: "4%",  size: 150, rot:  20, opacity: 0.15, floatY: 22, floatDur: 10, delay: 1.5  },
  { src: "/images/clothes/cloth-3.png",  left: "14%", top: "58%", size: 115, rot:  10, opacity: 0.16, floatY: 14, floatDur: 7,  delay: 0.8  },
  { src: "/images/clothes/cloth-4.png",  left: "68%", top: "52%", size: 125, rot: -25, opacity: 0.14, floatY: 20, floatDur: 9,  delay: 2    },
  { src: "/images/clothes/cloth-5.png",  left: "43%", top: "1%",  size: 140, rot:   8, opacity: 0.13, floatY: 16, floatDur: 11, delay: 0.4  },
  { src: "/images/clothes/cloth-6.png",  left: "88%", top: "33%", size: 110, rot: -30, opacity: 0.15, floatY: 24, floatDur: 8,  delay: 3    },
  { src: "/images/clothes/cloth-7.png",  left: "1%",  top: "36%", size: 120, rot:  18, opacity: 0.13, floatY: 12, floatDur: 12, delay: 1    },
];

function HeroClothingBg({ slideId }: { slideId: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BG_CLOTHES.map((item, i) => (
        <motion.div
          key={`${slideId}-${i}`}
          className="absolute"
          style={{ left: item.left, top: item.top, opacity: item.opacity }}
          initial={{ y: 40, opacity: 0, rotate: item.rot - 10, scale: 0.8 }}
          animate={{
            y: [0, -item.floatY, 0],
            opacity: [0, item.opacity, item.opacity, item.opacity * 0.7],
            rotate: [item.rot, item.rot + 5, item.rot - 3, item.rot],
            scale: 1,
          }}
          transition={{
            y:       { duration: item.floatDur, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            opacity: { duration: 1.2, ease: "easeOut", delay: item.delay * 0.3 },
            rotate:  { duration: item.floatDur * 1.3, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            scale:   { duration: 0.8, ease: [0.22, 1.15, 0.36, 1], delay: item.delay * 0.3 },
          }}
        >
          <div style={{ width: item.size, height: item.size, position: "relative" }}>
            <Image
              src={item.src}
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

type SlideDef = {
  id: number;
  eyebrow: string;
  headline: [string, string];
  accent: string;
  sub: string;
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  tag: string;
  stats: { v: string; l: string }[];
  accentColor: string;
  panelGradient: string;
  icon: typeof Globe2;
};

function buildSlides(t: (k: string) => string): SlideDef[] {
  const keys = ["0", "1", "2", "3", "4"] as const;
  return keys.map((k, id) => {
    const p = `hero.slides.${id}`;
    const h0 = t(`${p}.headline0`);
    const h1 = t(`${p}.headline1`);
    const accent = t(`${p}.accent`);
    return {
      id,
      eyebrow: t(`${p}.eyebrow`),
      headline: [h0, h1],
      accent,
      sub: t(`${p}.sub`),
      cta: {
        label: t(`${p}.cta`),
        href: ["/contact", "/products", "/capabilities", "/process", "/contact"][id] ?? "/contact",
      },
      ctaSecondary: {
        label: t(`${p}.ctaSecondary`),
        href: ["/products", "/products", "/contact", "/contact", "/process"][id] ?? "/products",
      },
      tag: t(`${p}.tag`),
      stats: [
        { v: t(`${p}.stat0v`), l: t(`${p}.stat0l`) },
        { v: t(`${p}.stat1v`), l: t(`${p}.stat1l`) },
        { v: t(`${p}.stat2v`), l: t(`${p}.stat2l`) },
      ],
      accentColor: [
        "from-red-500 to-red-300",
        "from-orange-400 to-red-400",
        "from-red-400 to-rose-300",
        "from-red-500 to-red-400",
        "from-red-300 to-white",
      ][id]!,
      panelGradient: [
        "from-red-950/40 via-zinc-950 to-black",
        "from-orange-950/30 via-zinc-950 to-black",
        "from-rose-950/30 via-zinc-950 to-black",
        "from-red-950/35 via-zinc-950 to-black",
        "from-zinc-900/60 via-zinc-950 to-black",
      ][id]!,
      icon: [Globe2, Package, Factory, Zap, ShieldCheck][id]!,
    };
  });
}

function Orb({ className, dur, delay }: { className: string; dur: number; delay: number }) {
  return (
    <motion.div className={className}
      animate={{ y: [0, -22, 0], x: [0, 12, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ScrollCue({ label }: { label: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 1 }}
      className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
        <motion.div className="h-1.5 w-0.5 rounded-full bg-red-400"
          animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[8px] uppercase tracking-[0.35em] text-zinc-600">{label}</span>
    </motion.div>
  );
}

function SlideContent({ slide, direction }: { slide: SlideDef; direction: number }) {
  const Icon = slide.icon;
  const variants = {
    enter: { opacity: 0, x: direction > 0 ? 60 : -60, filter: "blur(12px)" },
    center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: E } },
    exit: { opacity: 0, x: direction > 0 ? -60 : 60, filter: "blur(8px)", transition: { duration: 0.45, ease: E_IN } },
  };

  return (
    <motion.div key={slide.id} variants={variants} initial="enter" animate="center" exit="exit"
      className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8 lg:p-12"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
            <Icon className="h-3 w-3 text-red-400" />
          </div>
          <span className="truncate text-[9px] uppercase tracking-[0.2em] text-zinc-400 sm:text-[10px] sm:tracking-[0.25em]">
            {slide.eyebrow}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-400">{slide.tag}</span>
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-1 flex-col justify-center py-4 sm:py-8">
        <h2 className="text-[clamp(1.75rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight">
          {slide.headline.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <motion.span
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.22, 1.15, 0.36, 1], delay: 0.3 + li * 0.12 }}
                className={`inline-block ${line === slide.accent ? `bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent` : "text-white"}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, x: -50, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.55, duration: 0.75, ease: [0.22, 1.15, 0.36, 1] }}
          className="mt-3 text-[0.8rem] leading-relaxed text-zinc-400 sm:text-[0.9375rem]"
        >
          {slide.sub}
        </motion.p>
      </div>

      {/* Bottom — stats + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1.15, 0.36, 1] }}
          className="flex gap-4"
        >
          {slide.stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-sm font-black leading-none text-white sm:text-base">{s.v}</span>
              <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-500">{s.l}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.72, duration: 0.8, ease: [0.22, 1.15, 0.36, 1] }}
          className="flex flex-wrap gap-2"
        >
          <Link href={slide.cta.href}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-red-500 sm:px-5 sm:py-2.5 sm:text-[11px]"
          >
            {slide.cta.label}
            <ArrowRight className="h-3 w-3" />
            <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
          <Link href={slide.ctaSecondary.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-300 transition-all hover:border-white/40 hover:text-white sm:px-5 sm:py-2.5 sm:text-[11px]"
          >
            {slide.ctaSecondary.label}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const slides = useMemo(() => buildSlides(t), [t]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const panelY = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "6%"]), { stiffness: 50, damping: 18 });
  const panelOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const go = useCallback((idx: number, dir: number) => { setDirection(dir); setCurrent(idx); }, []);
  const next = useCallback(() => go((current + 1) % slides.length, 1), [current, go, slides.length]);
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length, -1), [current, go, slides.length]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 5500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next, paused]);

  const slide = slides[current];

  return (
    <section ref={sectionRef}
      className="relative isolate w-full max-w-[100vw] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(239,68,68,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_65%_at_-5%_45%,rgba(185,28,28,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-[0.1]" />
        <div className="noise-overlay opacity-[0.03]" />
        <Orb className="absolute -left-40 -top-10 h-[38rem] w-[38rem] rounded-full bg-red-700/[0.09] blur-[110px]" dur={13} delay={0} />
        <Orb className="absolute -right-20 top-1/4 h-[42rem] w-[42rem] rounded-full bg-red-500/[0.055] blur-[130px]" dur={16} delay={5} />
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: panelY, opacity: panelOpacity }}
        className="relative w-full will-change-transform"
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, x: -80, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1.15, 0.36, 1], delay: 0.1 }}
          className="flex items-center justify-center gap-3 px-4 pb-4 pt-20 sm:pt-24 lg:pt-32"
        >
          <span className="h-px w-8 bg-red-500/60" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-red-300/70">{t("hero.brand")}</span>
          <span className="h-px w-8 bg-red-500/60" />
        </motion.div>

        {/* Showcase panel — full width on mobile, max-w on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 100, y: -60, scale: 0.94, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.22, 1.15, 0.36, 1], delay: 0.25 }}
          className="mx-auto w-full px-0 sm:max-w-6xl sm:px-4 lg:px-6"
        >
          <div className="relative overflow-hidden border-y border-white/[0.08] bg-zinc-950 sm:rounded-[24px] sm:border">
            {/* Slide bg */}
            <AnimatePresence mode="wait">
              <motion.div key={`bg-${slide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }} className={`absolute inset-0 bg-gradient-to-br ${slide.panelGradient}`}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-grid bg-[size:32px_32px] opacity-[0.07]" />
            <motion.div key={`accent-${slide.id}`} initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: E }}
              className={`absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r ${slide.accentColor} opacity-70`}
            />

            {/* Slide content — auto height on mobile, fixed aspect on desktop */}
            <div className="relative min-h-[420px] w-full sm:aspect-[16/8] sm:min-h-0 lg:aspect-[16/6]">
              {/* ── Clothing background layer ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`clothes-${slide.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <HeroClothingBg slideId={slide.id} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait" custom={direction}>
                <SlideContent key={slide.id} slide={slide} direction={direction} />
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="relative flex items-center justify-between border-t border-white/[0.06] px-4 py-3 sm:px-8 sm:py-4">
              <div className="flex items-center gap-2">
                {slides.map((s, i) => (
                  <button key={s.id} onClick={() => go(i, i > current ? 1 : -1)}
                    suppressHydrationWarning className="group relative flex items-center" aria-label={t("hero.slide", { n: String(i + 1) })}
                  >
                    <motion.div
                      animate={{ width: i === current ? 24 : 6, backgroundColor: i === current ? "rgb(239,68,68)" : "rgba(255,255,255,0.2)" }}
                      transition={{ duration: 0.4, ease: E }} className="h-1.5 rounded-full"
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={prev} suppressHydrationWarning aria-label={t("hero.prev")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] text-zinc-400 hover:border-white/25 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} suppressHydrationWarning aria-label={t("hero.next")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] text-zinc-400 hover:border-white/25 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!paused && (
              <motion.div key={`progress-${current}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-red-500/40"
              />
            )}
          </div>

          {/* Floating stat cards — desktop only */}
          <AnimatePresence mode="wait">
            <motion.div key={`stat-left-${slide.id}`}
              initial={{ opacity: 0, x: -24, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.6, ease: E, delay: 0.4 }}
              className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/[0.09] bg-zinc-900/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl md:block"
            >
              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">{slide.stats[0].l}</p>
              <p className="mt-0.5 text-xl font-black text-white">{slide.stats[0].v}</p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={`stat-right-${slide.id}`}
              initial={{ opacity: 0, x: 24, y: -8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.6, ease: E, delay: 0.5 }}
              className="absolute -right-4 -top-5 hidden rounded-2xl border border-red-500/20 bg-zinc-900/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl md:block"
            >
              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">{slide.stats[2].l}</p>
              <p className="mt-0.5 text-xl font-black text-white">{slide.stats[2].v}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 pb-10 pt-6 sm:gap-x-8 sm:pb-16"
        >
          {[
            { icon: ShieldCheck, labelKey: "hero.trustIso" as const },
            { icon: Globe2, labelKey: "hero.trustMarkets" as const },
            { icon: Package, labelKey: "hero.trustMoq" as const },
            { icon: Factory, labelKey: "hero.trustVertical" as const },
          ].map(({ icon: Icon, labelKey }) => (
            <div key={labelKey} className="flex items-center gap-2 text-zinc-500">
              <Icon className="h-3.5 w-3.5 text-red-500/60" />
              <span className="text-[10px] uppercase tracking-[0.15em] sm:text-[11px] sm:tracking-[0.18em]">{t(labelKey)}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <ScrollCue label={t("hero.scroll")} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </section>
  );
}
