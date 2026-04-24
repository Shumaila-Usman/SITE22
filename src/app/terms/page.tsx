import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Policy | Megacore International",
  description:
    "MOQ, payment terms, sampling policy, production lead times, and order conditions for Megacore International.",
};

const sections = [
  {
    id: "moq",
    title: "Minimum Order Quantity (MOQ)",
    content: [
      "The minimum order quantity is 50 pieces per style, per color.",
      "MOQ applies to all product categories including custom OEM, private label, and standard sportswear lines.",
      "Orders below the MOQ threshold may be considered on a case-by-case basis and may be subject to a small-order surcharge.",
      "Bulk orders above 500 pieces per style qualify for volume pricing — contact us for a custom quote.",
    ],
  },
  {
    id: "payment",
    title: "Payment Terms",
    content: [
      "All orders are processed on an advance payment basis.",
      "A deposit is required before production commences. The exact percentage is agreed upon during the order confirmation stage.",
      "The remaining balance is due prior to shipment unless otherwise agreed in writing.",
      "Accepted payment methods include bank transfer (T/T), Western Union, and other methods as mutually agreed.",
      "All prices are quoted in USD unless otherwise specified.",
    ],
  },
  {
    id: "sampling",
    title: "Sampling Policy",
    content: [
      "Pre-production samples are prepared for all new orders before bulk production begins.",
      "Standard sample lead time is 5–7 business days from order confirmation.",
      "Sample costs may apply and are typically deducted from the bulk order invoice upon confirmation.",
      "Bulk production does not commence until the buyer has approved the pre-production sample in writing.",
      "Any changes requested after sample approval may affect lead times and pricing.",
    ],
  },
  {
    id: "production",
    title: "Production Lead Times",
    content: [
      "Standard production lead time is 15–25 business days after sample approval and advance payment confirmation.",
      "Lead times may vary depending on order volume, fabric availability, and seasonal demand.",
      "Rush production may be available for an additional fee — subject to capacity.",
      "Megacore International will communicate any delays promptly and work to minimise disruption.",
    ],
  },
  {
    id: "quality",
    title: "Quality Assurance",
    content: [
      "All production is carried out under ISO 9001 certified quality management processes.",
      "Inline quality checks are performed at cutting, sewing, finishing, and packing stages.",
      "Final inspection is conducted before packaging and shipment.",
      "Any defective items identified during QC are replaced before dispatch.",
      "Buyers are encouraged to specify quality standards and tolerances at the order confirmation stage.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Export",
    content: [
      "Megacore International ships globally. All major international markets are served.",
      "Export documentation including commercial invoice, packing list, and certificate of origin is provided as standard.",
      "Shipping terms (FOB or EXW) are agreed upon at the order confirmation stage.",
      "Megacore International is not liable for delays caused by customs clearance, freight carriers, or force majeure events.",
      "Buyers are responsible for import duties, taxes, and customs clearance in their country.",
    ],
  },
  {
    id: "cancellation",
    title: "Order Cancellation & Changes",
    content: [
      "Orders may not be cancelled once production has commenced.",
      "Changes to specifications after sample approval may not be possible and may affect pricing and lead times.",
      "Cancellation requests before production begins must be submitted in writing and are subject to a cancellation fee covering costs incurred.",
      "Megacore International reserves the right to cancel an order if advance payment is not received within the agreed timeframe.",
    ],
  },
  {
    id: "communication",
    title: "Communication & Inquiry",
    content: [
      "All inquiries are responded to within 24 business hours.",
      "Buyers are encouraged to discuss requirements fully before placing an order — there is no obligation to commit until both parties are satisfied.",
      "All order confirmations, approvals, and changes must be communicated in writing (email or WhatsApp message).",
      "Megacore International communicates directly with buyers — no middlemen.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-14 border-b border-white/[0.07] pb-10">
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            Legal & Policy
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            Terms &amp; Policy
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-zinc-400">
            Order terms, MOQ policy, payment conditions, and production
            guidelines for all Megacore International orders. Please read
            before placing an inquiry.
          </p>
          <p className="mt-4 text-xs text-zinc-600">
            Last updated: January 2025
          </p>
        </div>

        {/* Quick nav */}
        <div className="mb-14 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Jump to section
          </p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-wider text-zinc-400 transition-colors hover:border-red-500/30 hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="scroll-mt-28 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                  0{i + 1}
                </span>
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                  {s.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {s.content.map((line, li) => (
                  <li key={li} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500/60" />
                    <span className="text-sm leading-relaxed text-zinc-300">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-zinc-950 to-black p-10 text-center">
          <h3 className="mb-3 text-xl font-black uppercase text-white">
            Questions About Our Terms?
          </h3>
          <p className="mb-6 text-sm text-zinc-400">
            Contact us directly before placing an order. We're happy to clarify
            any policy or discuss custom arrangements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500"
          >
            Contact Us
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}
