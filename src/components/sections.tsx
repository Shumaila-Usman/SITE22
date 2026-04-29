"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Factory,
  Gauge,
  Globe2,
  MessageCircle,
  Package,
  PackageCheck,
  Plane,
  Printer,
  Ruler,
  Shirt,
  ShieldCheck,
  Star,
  Timer,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
      <span className="h-px w-6 bg-red-500" />
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-black uppercase leading-[1.05] text-white md:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── 1. Trust Strip ───────────────────────────────────────────────────────────
export function StatsStrip() {
  const { t } = useLanguage();
  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    value: t(`sections.statsStrip.items.${i}.value`),
    label: t(`sections.statsStrip.items.${i}.label`),
  }));

  return (
    <section className="relative border-y border-white/[0.06] bg-zinc-950/60 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <FadeUp key={item.label} delay={i * 0.07}>
              <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
                <span className="text-2xl font-black text-white md:text-3xl">
                  {item.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {item.label}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. About Preview ─────────────────────────────────────────────────────────
export function AboutPreview() {
  const { t } = useLanguage();
  const pillars = [
    { icon: Factory, title: t("sections.aboutPreview.pillars.0.title"), desc: t("sections.aboutPreview.pillars.0.desc") },
    { icon: Globe2, title: t("sections.aboutPreview.pillars.1.title"), desc: t("sections.aboutPreview.pillars.1.desc") },
    { icon: ShieldCheck, title: t("sections.aboutPreview.pillars.2.title"), desc: t("sections.aboutPreview.pillars.2.desc") },
  ];

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="section-glow -left-20 top-10" />
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <FadeUp>
            <SectionLabel>{t("sections.aboutPreview.label")}</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mb-6">
              {t("sections.aboutPreview.heading")}
            </SectionHeading>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mb-6 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.aboutPreview.p1")}
            </p>
            <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.aboutPreview.p2")}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link href="/about">
              <Button variant="outline" className="group border-white/20 hover:border-white/40">
                {t("sections.aboutPreview.cta")}
                <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Button>
            </Link>
          </FadeUp>
        </div>
        <div className="grid gap-4">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeUp key={p.title} delay={0.15 + i * 0.1}>
                <div className="group flex gap-5 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5 transition-colors hover:border-red-500/20 hover:bg-zinc-900/80">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 3. Product Categories ────────────────────────────────────────────────────
// ─── 3. Product Categories ────────────────────────────────────────────────────
export function ProductShowcase() {
  const { t } = useLanguage();
  const slugs = ["sports-wear", "fitness-wear", "casual-wear"] as const;
  const categories = [0, 1, 2].map((i) => {
    const p = `sections.productShowcase.categories.${i}`;
    const itemCount = 6;
    const items = Array.from({ length: itemCount }, (_, j) => t(`${p}.items.${j}`));
    return {
      name: t(`${p}.name`),
      slug: slugs[i],
      desc: t(`${p}.desc`),
      moq: t(`${p}.moq`),
      image: ["/images/products/sports-wear.jpg", "/images/products/fitness-wear.jpg", "/images/products/casual-wear.jpg"][i]!,
      items,
      col: ["from-red-600/30", "from-orange-700/25", "from-rose-700/25"][i]!,
      span: "md:col-span-4" as const,
    };
  });

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24" direction="left">
      <div className="section-glow -right-10 top-20" />
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <FadeUp><SectionLabel>{t("sections.productShowcase.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading>{t("sections.productShowcase.heading")}</SectionHeading>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <Link href="/products">
            <Button variant="outline" className="group border-white/20 hover:border-white/40">
              {t("sections.productShowcase.cta")}
              <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Button>
          </Link>
        </FadeUp>
      </div>
      <div className="grid gap-5 md:grid-cols-12">
        {categories.map((c, i) => (
          <motion.article
            key={c.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.65, ease: EASE, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/70 transition-colors hover:border-white/[0.14]",
              c.span,
            )}
          >
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-50 transition-opacity group-hover:opacity-70", c.col)} />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm">
                {c.moq}
              </span>
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-lg font-bold uppercase text-white">{c.name}</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
              {/* Item tags */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {c.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                    {item}
                  </span>
                ))}
              </div>
              <Link href={`/products/${c.slug}`} className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 transition-colors group-hover:text-red-300">
                {t("sections.productShowcase.explore")} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── 4. Why Choose Us ─────────────────────────────────────────────────────────
export function WhyChooseUs() {
  const { t } = useLanguage();
  const reasons = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: [Factory, Ruler, Globe2, Package, MessageCircle, Award][i]!,
    title: t(`sections.whyChoose.reasons.${i}.title`),
    desc: t(`sections.whyChoose.reasons.${i}.desc`),
  }));

  return (
    <AnimatedSection className="relative bg-zinc-950/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <FadeUp><SectionLabel>{t("sections.whyChoose.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mx-auto max-w-2xl">
              {t("sections.whyChoose.heading")}
            </SectionHeading>
          </FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <FadeUp key={r.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all duration-300 hover:border-red-500/20 hover:bg-zinc-900/90">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{r.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 5. OEM / Custom Manufacturing ───────────────────────────────────────────
export function OEMSection() {
  const { t } = useLanguage();
  const features = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: [Shirt, Printer, Ruler, Package, Zap, Globe2][i]!,
    label: t(`sections.oem.features.${i}`),
  }));

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24" direction="right">
      <div className="section-glow left-10 top-20" />
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <FadeUp><SectionLabel>{t("sections.oem.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mb-6">
              {t("sections.oem.heading")}
            </SectionHeading>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mb-6 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.oem.p1")}
            </p>
            <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.oem.p2")}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link href="/capabilities">
              <Button className="group relative overflow-hidden">
                {t("sections.oem.cta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </Button>
            </Link>
          </FadeUp>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.label} delay={0.1 + i * 0.07}>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-zinc-900/60 px-4 py-4 transition-colors hover:border-red-500/20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-300">
                    {f.label}
                  </span>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 6. Order Process ─────────────────────────────────────────────────────────
export function ProcessFlow() {
  const { t } = useLanguage();
  const steps = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: [MessageCircle, Ruler, Gauge, Timer, PackageCheck, Plane][i]!,
    step: t(`sections.processFlow.steps.${i}.step`),
    title: t(`sections.processFlow.steps.${i}.title`),
    desc: t(`sections.processFlow.steps.${i}.desc`),
  }));

  return (
    <AnimatedSection className="relative bg-zinc-950/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <FadeUp><SectionLabel>{t("sections.processFlow.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mx-auto max-w-xl">
              {t("sections.processFlow.heading")}
            </SectionHeading>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
              {t("sections.processFlow.sub")}
            </p>
          </FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                  <div className="absolute right-5 top-5 text-[3rem] font-black leading-none text-white/[0.04]">
                    {s.step}
                  </div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {t("sections.processFlow.stepWord")} {s.step}
                  </p>
                  <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
        <FadeUp delay={0.5} className="mt-10 text-center">
          <Link href="/process">
            <Button variant="outline" className="group border-white/20 hover:border-white/40">
              {t("sections.processFlow.cta")}
              <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Button>
          </Link>
        </FadeUp>
      </div>
    </AnimatedSection>
  );
}

// ─── 7. MOQ & Payment Policy ──────────────────────────────────────────────────
export function MOQSection() {
  const { t } = useLanguage();
  const policies = [0, 1, 2, 3].map((i) => ({
    label: t(`sections.moq.policies.${i}.label`),
    value: t(`sections.moq.policies.${i}.value`),
    note: t(`sections.moq.policies.${i}.note`),
  }));

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="section-glow -right-10 top-10" />
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <FadeUp><SectionLabel>{t("sections.moq.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mb-6">
              {t("sections.moq.heading")}
            </SectionHeading>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mb-4 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.moq.p1")}
            </p>
            <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.moq.p2")}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link href="/terms">
              <Button variant="outline" className="group border-white/20 hover:border-white/40">
                {t("sections.moq.cta")}
                <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Button>
            </Link>
          </FadeUp>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((p, i) => (
            <FadeUp key={p.label} delay={0.1 + i * 0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/70 p-6">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-600 via-red-400 to-transparent" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {p.label}
                </p>
                <p className="mt-2 text-2xl font-black text-white">{p.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{p.note}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 8. Quality & Manufacturing Standards ─────────────────────────────────────
export function QualitySection() {
  const { t } = useLanguage();
  const standards = [0, 1, 2, 3].map((i) => ({
    icon: [ShieldCheck, Gauge, Ruler, Truck][i]!,
    title: t(`sections.quality.standards.${i}.title`),
    desc: t(`sections.quality.standards.${i}.desc`),
  }));

  return (
    <AnimatedSection className="relative bg-zinc-950/40 py-24" direction="left">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <FadeUp><SectionLabel>{t("sections.quality.label")}</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <SectionHeading>
                {t("sections.quality.heading")}
              </SectionHeading>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <p className="text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.quality.intro")}
            </p>
          </FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {standards.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 9. Global Buyer Trust ────────────────────────────────────────────────────
export function BuyerTrustSection() {
  const { t } = useLanguage();
  const commitments = [0, 1, 2, 3, 4, 5].map((i) => t(`sections.buyerTrust.commitments.${i}`));

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="section-glow left-1/2 top-10 -translate-x-1/2" />
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-zinc-900/80 via-zinc-950 to-black">
        <div className="grid lg:grid-cols-2">
          {/* Left */}
          <div className="border-b border-white/[0.07] p-10 lg:border-b-0 lg:border-r lg:p-14">
            <FadeUp><SectionLabel>{t("sections.buyerTrust.label")}</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <SectionHeading className="mb-6">
                {t("sections.buyerTrust.heading")}
              </SectionHeading>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mb-6 text-[1.0625rem] leading-[1.75] text-zinc-400">
                {t("sections.buyerTrust.p1")}
              </p>
              <p className="text-[1.0625rem] leading-[1.75] text-zinc-400">
                {t("sections.buyerTrust.p2")}
              </p>
            </FadeUp>
          </div>
          {/* Right */}
          <div className="p-10 lg:p-14">
            <FadeUp delay={0.1}>
              <h3 className="mb-7 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
                {t("sections.buyerTrust.commitmentsTitle")}
              </h3>
            </FadeUp>
            <ul className="space-y-4">
              {commitments.map((c, i) => (
                <FadeUp key={i} delay={0.15 + i * 0.07}>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span className="text-sm leading-relaxed text-zinc-300">{c}</span>
                  </li>
                </FadeUp>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 10. Testimonials / Buyer Assurance ───────────────────────────────────────
export function TestimonialsSection() {
  const { t } = useLanguage();
  const quotes = [0, 1, 2].map((i) => ({
    quote: t(`sections.testimonials.quotes.${i}.quote`),
    name: t(`sections.testimonials.quotes.${i}.name`),
    region: t(`sections.testimonials.quotes.${i}.region`),
    initial: t(`sections.testimonials.quotes.${i}.initial`),
  }));

  return (
    <AnimatedSection className="relative bg-zinc-950/40 py-24" direction="right">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <FadeUp><SectionLabel>{t("sections.testimonials.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mx-auto max-w-xl">
              {t("sections.testimonials.heading")}
            </SectionHeading>
          </FadeUp>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {quotes.map((q, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-[1.8] text-zinc-300">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/20 text-sm font-bold text-red-400">
                    {q.initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{q.name}</p>
                    <p className="text-[10px] text-zinc-500">{q.region}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 11. FAQ Preview ──────────────────────────────────────────────────────────
export function FAQSection() {
  const { t } = useLanguage();
  const faqs = [0, 1, 2, 3, 4, 5].map((i) => ({
    q: t(`sections.faq.items.${i}.q`),
    a: t(`sections.faq.items.${i}.a`),
  }));

  function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
    const [open, setOpen] = useState(false);
    return (
      <FadeUp delay={i * 0.07}>
        <div className="border-b border-white/[0.07]">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open}
            suppressHydrationWarning
          >
            <span className="text-sm font-semibold text-white">{q}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 text-zinc-400"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-zinc-400">{a}</p>
          </motion.div>
        </div>
      </FadeUp>
    );
  }

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <FadeUp><SectionLabel>{t("sections.faq.label")}</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <SectionHeading className="mb-6">
              {t("sections.faq.heading")}
            </SectionHeading>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.faq.intro")}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link href="/contact">
              <Button variant="outline" className="group border-white/20 hover:border-white/40">
                {t("sections.faq.cta")}
                <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Button>
            </Link>
          </FadeUp>
        </div>
        <div>
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 12. Contact Preview ──────────────────────────────────────────────────────
export function ContactPreview() {
  const { t } = useLanguage();
  const placeholders = [0, 1, 2].map((i) => t(`sections.contactPreview.placeholders.${i}`));
  return (
    <AnimatedSection className="relative bg-zinc-950/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <FadeUp><SectionLabel>{t("sections.contactPreview.label")}</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <SectionHeading className="mb-6">
                {t("sections.contactPreview.heading")}
              </SectionHeading>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">
                {t("sections.contactPreview.p1")}
              </p>
            </FadeUp>
            <FadeUp delay={0.3} className="flex flex-wrap gap-3">
              <motion.a
                href="https://wa.me/923377270001"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,211,102,0.2)] transition-shadow hover:shadow-[0_0_28px_rgba(37,211,102,0.35)]"
              >
                <MessageCircle className="h-4 w-4" />
                {t("sections.contactPreview.wa")}
              </motion.a>
              <motion.a
                href="mailto:info@megacoreinternational.com"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
              >
                {t("sections.contactPreview.email")}
              </motion.a>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-8">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
                {t("sections.contactPreview.formTitle")}
              </h3>
              <div className="space-y-4">
                {placeholders.map((placeholder, i) => (
                  <div key={i}>
                    {i < 2 ? (
                      <input
                        suppressHydrationWarning
                        type="text"
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/40 focus:bg-white/[0.06]"
                      />
                    ) : (
                      <textarea
                        suppressHydrationWarning
                        placeholder={placeholder}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/40 focus:bg-white/[0.06]"
                      />
                    )}
                  </div>
                ))}
                <Link href="/contact">
                  <Button className="group relative w-full overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {t("sections.contactPreview.cta")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </Button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 13. Final CTA ────────────────────────────────────────────────────────────
export function CTASection() {
  const { t } = useLanguage();
  return (
    <AnimatedSection className="mx-auto max-w-7xl px-6 pb-28 pt-8">
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/60 via-zinc-950 to-black p-12 text-center md:p-20">
          {/* Background glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-red-800/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
              <span className="h-px w-6 bg-red-500" />
              {t("sections.cta.label")}
              <span className="h-px w-6 bg-red-500" />
            </span>
            <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-black uppercase leading-[1.05] text-white md:text-5xl">
              {t("sections.cta.heading")}
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-[1.0625rem] leading-[1.75] text-zinc-400">
              {t("sections.cta.p1")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <Link href="/contact">
                  <Button size="lg" className="group relative overflow-hidden rounded-full px-8">
                    <span className="relative z-10 flex items-center gap-2.5">
                      {t("sections.cta.primary")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </Button>
                </Link>
              </motion.div>
              <motion.a
                href="https://wa.me/923377270001"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                {t("sections.cta.wa")}
              </motion.a>
            </div>
          </div>
        </div>
      </FadeUp>
    </AnimatedSection>
  );
}
