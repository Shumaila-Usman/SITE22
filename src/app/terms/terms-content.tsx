"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const SECTION_ORDER = [
  "moq",
  "payment",
  "sampling",
  "production",
  "quality",
  "shipping",
  "cancellation",
  "communication",
] as const;

export function TermsContent() {
  const { t } = useLanguage();

  function sectionLines(sectionIndex: number): string[] {
    const lines: string[] = [];
    for (let j = 0; j < 12; j++) {
      const key = `terms.sections.${sectionIndex}.content.${j}`;
      const val = t(key);
      if (val === key) break;
      lines.push(val);
    }
    return lines;
  }

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-4xl px-6">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("terms.backHome")}
        </Link>

        <div className="mb-14 border-b border-white/[0.07] pb-10">
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            {t("terms.eyebrow")}
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            {t("terms.title")}
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-zinc-400">{t("terms.intro")}</p>
          <p className="mt-4 text-xs text-zinc-600">{t("terms.updated")}</p>
        </div>

        <div className="mb-14 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500">{t("terms.jumpTo")}</p>
          <div className="flex flex-wrap gap-2">
            {SECTION_ORDER.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-wider text-zinc-400 transition-colors hover:border-red-500/30 hover:text-white"
              >
                {t(`terms.sections.${i}.title`)}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {SECTION_ORDER.map((id, i) => (
            <div
              key={id}
              id={id}
              className="scroll-mt-28 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                  {t(`terms.sections.${i}.title`)}
                </h2>
              </div>
              <ul className="space-y-3">
                {sectionLines(i).map((line, li) => (
                  <li key={li} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500/60" />
                    <span className="text-sm leading-relaxed text-zinc-300">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-zinc-950 to-black p-10 text-center">
          <h3 className="mb-3 text-xl font-black uppercase text-white">{t("terms.ctaTitle")}</h3>
          <p className="mb-6 text-sm text-zinc-400">{t("terms.ctaBody")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500"
          >
            {t("terms.ctaButton")}
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}
