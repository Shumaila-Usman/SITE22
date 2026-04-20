import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start A Project"
        title="Connect With Our Export & Production Team"
        description="Send your target quantity, product category, and timeline. We will map a fast, realistic production roadmap."
      />
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="section-glow right-6 top-10" />
        <form className="grid gap-5 rounded-2xl border border-white/10 bg-[linear-gradient(130deg,rgba(24,24,27,0.95),rgba(39,39,42,0.85))] p-8 md:grid-cols-2">
          <input
            className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:-translate-y-0.5 focus:border-red-500"
            placeholder="Your Name"
          />
          <input
            className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:-translate-y-0.5 focus:border-red-500"
            placeholder="Company"
          />
          <input
            className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:-translate-y-0.5 focus:border-red-500"
            placeholder="Email"
          />
          <input
            className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:-translate-y-0.5 focus:border-red-500"
            placeholder="Target Monthly Quantity"
          />
          <textarea
            className="min-h-40 rounded-md border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:-translate-y-0.5 focus:border-red-500 md:col-span-2"
            placeholder="Tell us about your product line and timeline..."
          />
          <div className="md:col-span-2">
            <Button size="lg">Submit Production Inquiry</Button>
          </div>
        </form>
      </section>
    </>
  );
}
