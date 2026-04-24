"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe2, Mail, MessageCircle, Phone } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: EASE, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const inputCls = "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/50 focus:bg-white/[0.06]";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", country: "", category: "", quantity: "", message: "" });
  const [sent, setSent] = useState(false);

  function set(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hello, I am contacting you from the Megacore International website.\n\nName: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nCountry: ${form.country}\nProduct Category: ${form.category}\nQuantity: ${form.quantity}\n\nMessage:\n${form.message}\n\nThank you.`;
    window.open(`https://wa.me/923375917017?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.09),transparent_60%)]" />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Get In Touch</span></FadeUp>
        <FadeUp delay={0.1}><h1 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl md:text-7xl">Start Your Order Discussion</h1></FadeUp>
        <FadeUp delay={0.2}><p className="max-w-2xl text-lg leading-relaxed text-zinc-400">Send us your requirements and we'll respond within 24 hours. No commitment required — just a professional conversation about what you need and how we can deliver it.</p></FadeUp>
      </section>

      {/* Contact grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">

          {/* Left — contact info */}
          <div className="space-y-6">
            <FadeUp>
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Contact Details</h3>
                <div className="space-y-5">
                  {[
                    { icon: MessageCircle, label: "WhatsApp", value: "+92 337 5917017", href: "https://wa.me/923375917017", color: "text-[#25D366]" },
                    { icon: Mail, label: "Email", value: "megacoreintl@gmail.com", href: "mailto:megacoreintl@gmail.com", color: "text-red-400" },
                    { icon: Mail, label: "Email", value: "info@megacoreintl.com", href: "mailto:info@megacoreintl.com", color: "text-red-400" },
                    { icon: Phone, label: "Phone", value: "+92 337 5917017", href: "tel:+923375917017", color: "text-zinc-300" },
                    { icon: Globe2, label: "Location", value: "Rangers Road, Sialkot — 51300", href: "#", color: "text-zinc-300" },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] transition-colors group-hover:border-red-500/30">
                          <Icon className={`h-4 w-4 ${c.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500">{c.label}</p>
                          <p className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">{c.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Response Commitments</h3>
                <ul className="space-y-3">
                  {["Reply within 24 business hours", "No commitment required to inquire", "Direct communication — no middlemen", "Samples before bulk production", "Professional export documentation"].map((c, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-sm text-zinc-300">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <a href="https://wa.me/923375917017" target="_blank" rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(37,211,102,0.2)] transition-all hover:bg-[#1fba58] hover:shadow-[0_0_40px_rgba(37,211,102,0.35)]">
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </FadeUp>
          </div>

          {/* Right — inquiry form */}
          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-8">
              <h3 className="mb-7 text-base font-bold uppercase tracking-[0.2em] text-white">Send an Inquiry</h3>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green-400" />
                  <h4 className="mb-2 text-lg font-bold text-white">Message Sent!</h4>
                  <p className="text-sm text-zinc-400">Your inquiry has been sent via WhatsApp. We'll respond within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-xs text-red-400 underline">Send another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleWhatsApp} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Full Name *</label>
                      <input suppressHydrationWarning required placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Company / Brand</label>
                      <input suppressHydrationWarning placeholder="Company name" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Email Address *</label>
                      <input suppressHydrationWarning required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Country</label>
                      <input suppressHydrationWarning placeholder="Your country" value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Product Category</label>
                      <select suppressHydrationWarning value={form.category} onChange={(e) => set("category", e.target.value)}
                        className={`${inputCls} appearance-none`}>
                        <option value="" className="bg-zinc-900">Select category</option>
                        <option value="Sports Wear" className="bg-zinc-900">Sports Wear</option>
                        <option value="Fitness Wear" className="bg-zinc-900">Fitness Wear</option>
                        <option value="Casual Wear" className="bg-zinc-900">Casual Wear</option>
                        <option value="Custom OEM" className="bg-zinc-900">Custom OEM / Private Label</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Estimated Quantity</label>
                      <input suppressHydrationWarning placeholder="e.g. 500 pcs" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Message / Requirements</label>
                    <textarea suppressHydrationWarning rows={4} placeholder="Describe your product requirements, customization needs, timeline..." value={form.message} onChange={(e) => set("message", e.target.value)} className={`${inputCls} resize-none`} />
                  </div>
                  <button type="submit"
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500">
                    <MessageCircle className="h-4 w-4" />
                    Send via WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>
                  <p className="text-center text-[10px] text-zinc-600">WhatsApp opens with your message pre-filled — tap <strong className="text-zinc-500">Send</strong> to submit your inquiry</p>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Before You Inquire</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">Quick Answers</h2></FadeUp>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              { q: "What is the minimum order quantity?", a: "50 pieces per style, per color. This applies to all categories including custom OEM orders." },
              { q: "Do I need to commit before discussing?", a: "No. We encourage full discussion of your requirements before any order is placed. There is no obligation until you are satisfied." },
              { q: "How long does sampling take?", a: "Pre-production samples are typically ready in 5–7 business days from order confirmation." },
              { q: "Is advance payment required?", a: "Yes. All orders are processed on an advance payment basis. The exact percentage is agreed before production begins." },
              { q: "Do you offer custom logos and private labels?", a: "Yes. Full OEM and private label services are available including custom logos, labels, packaging, and branding." },
            ].map((f, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="rounded-xl border border-white/[0.07] bg-zinc-900/60 p-6">
                  <h3 className="mb-2 text-sm font-bold text-white">{f.q}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{f.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
