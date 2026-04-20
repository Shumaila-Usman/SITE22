import { AnimatedSection } from "@/components/animated-section";
import { PageHero } from "@/components/page-hero";

const blocks = [
  "Fabric sourcing and performance material consultation",
  "In-house sublimation, screen print, and embroidery lines",
  "Precision cutting and high-speed assembly operations",
  "Final QC with AQL-compliant inspection checkpoints",
  "Global packing standards and export documentation",
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing Power"
        title="Integrated Industrial Capacity For Fast Execution"
        description="Every stage from development to dispatch runs inside a synchronized production network tuned for speed and consistency."
      />
      <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="section-glow -left-28 top-24" />
        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((line, idx) => (
            <div
              key={line}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/70 p-6 transition hover:-translate-y-1 hover:border-red-500/50"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-500 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/0 to-red-500/0 transition duration-300 group-hover:from-red-500/10 group-hover:via-transparent group-hover:to-transparent" />
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Module 0{idx + 1}
              </p>
              <p className="mt-3 text-lg font-semibold text-zinc-100">{line}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
