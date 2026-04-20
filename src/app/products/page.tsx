import { AnimatedSection } from "@/components/animated-section";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui/card";

const products = [
  { name: "Performance Jerseys", desc: "Lightweight breathability with pro fit." },
  { name: "Compression Sets", desc: "Muscle support with moisture transport layers." },
  { name: "Training Wear", desc: "Durable daily-use silhouettes with stretch systems." },
  { name: "Lifestyle Athleisure", desc: "Street-athletic fusion for retail programs." },
  { name: "Teamwear Packages", desc: "Full-kit production for clubs and institutions." },
  { name: "Outerwear", desc: "Weather defense for outdoor training environments." },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product Architecture"
        title="Category Systems Built For Athletic Motion"
        description="Our category-led manufacturing tracks your brand identity while keeping every style production-ready and export-compliant."
      />
      <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="section-glow -top-20 right-0" />
        <div className="grid gap-5 md:grid-cols-6">
          {products.map((product, idx) => (
            <Card
              key={product.name}
              className="group relative overflow-hidden p-6 transition hover:-translate-y-1.5 hover:border-red-500/60 md:col-span-3 lg:col-span-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-500/0 transition group-hover:from-red-700/25 group-hover:to-transparent" />
              <div className="absolute -left-10 -top-12 h-24 w-24 rounded-full bg-red-500/20 blur-2xl transition group-hover:scale-110" />
              <p className="relative text-xs uppercase tracking-[0.2em] text-zinc-500">
                Category {idx + 1}
              </p>
              <h2 className="relative mt-3 text-2xl font-bold uppercase text-white">
                {product.name}
              </h2>
              <p className="relative mt-3 text-sm text-zinc-300">{product.desc}</p>
              <span className="relative mt-6 inline-block rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs text-red-300">
                MOQ from 400 pcs
              </span>
            </Card>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
