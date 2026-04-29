"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe2, Mail, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/context/language-context";

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
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", company: "", email: "", country: "", category: "", quantity: "", message: "" });
  const [sent, setSent] = useState(false);

  function set(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    const intro = t("whatsapp.contactIntro");
    const body = t("whatsapp.contactFields", {
      name: form.name,
      company: form.company,
      email: form.email,
      country: form.country,
      category: form.category,
      quantity: form.quantity,
      message: form.message,
    });
    const msg = `${intro}\n\n${body}`;
    window.open(`https://wa.me/923377270001?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  }

  const contactRows = [
    { icon: MessageCircle, labelKey: "contact.waLabels.whatsapp" as const, value: "0337 7270001", href: "https://wa.me/923377270001", color: "text-[#25D366]" },
    { icon: Mail, labelKey: "contact.waLabels.email" as const, value: "megacoreintl@gmail.com", href: "mailto:megacoreintl@gmail.com", color: "text-red-400" },
    { icon: Mail, labelKey: "contact.waLabels.email" as const, value: "info@megacoreintl.com", href: "mailto:info@megacoreintl.com", color: "text-red-400" },
    { icon: Phone, labelKey: "contact.waLabels.phone" as const, value: "0337 7270001", href: "tel:+923377270001", color: "text-zinc-300" },
    { icon: Globe2, labelKey: "contact.waLabels.location" as const, value: "Rangers Road, Sialkot — 51300", href: "#", color: "text-zinc-300" },
  ];

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.09),transparent_60%)]" />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />{t("contact.eyebrow")}</span></FadeUp>
        <FadeUp delay={0.1}><h1 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl md:text-7xl">{t("contact.title")}</h1></FadeUp>
        <FadeUp delay={0.2}><p className="max-w-2xl text-lg leading-relaxed text-zinc-400">{t("contact.subtitle")}</p></FadeUp>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">

          <div className="space-y-6">
            <FadeUp>
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">{t("contact.detailsTitle")}</h3>
                <div className="space-y-5">
                  {contactRows.map((c, idx) => {
                    const Icon = c.icon;
                    return (
                      <a key={idx} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] transition-colors group-hover:border-red-500/30">
                          <Icon className={`h-4 w-4 ${c.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500">{t(c.labelKey)}</p>
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
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">{t("contact.commitmentsTitle")}</h3>
                <ul className="space-y-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-sm text-zinc-300">{t(`contact.commitments.${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <a href="https://wa.me/923377270001" target="_blank" rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(37,211,102,0.2)] transition-all hover:bg-[#1fba58] hover:shadow-[0_0_40px_rgba(37,211,102,0.35)]">
                <MessageCircle className="h-5 w-5" /> {t("contact.waChat")}
              </a>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-8">
              <h3 className="mb-7 text-base font-bold uppercase tracking-[0.2em] text-white">{t("contact.formTitle")}</h3>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green-400" />
                  <h4 className="mb-2 text-lg font-bold text-white">{t("contact.sentTitle")}</h4>
                  <p className="text-sm text-zinc-400">{t("contact.sentBody")}</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-6 text-xs text-red-400 underline">{t("contact.sendAnother")}</button>
                </div>
              ) : (
                <form onSubmit={handleWhatsApp} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.name")}</label>
                      <input suppressHydrationWarning required placeholder={t("contact.placeholders.name")} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.company")}</label>
                      <input suppressHydrationWarning placeholder={t("contact.placeholders.company")} value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.email")}</label>
                      <input suppressHydrationWarning required type="email" placeholder={t("contact.placeholders.email")} value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.country")}</label>
                      <input suppressHydrationWarning placeholder={t("contact.placeholders.country")} value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.category")}</label>
                      <select suppressHydrationWarning value={form.category} onChange={(e) => set("category", e.target.value)}
                        className={`${inputCls} appearance-none`}>
                        <option value="" className="bg-zinc-900">{t("contact.selectCategory")}</option>
                        <option value="Sports Wear" className="bg-zinc-900">{t("contact.catSports")}</option>
                        <option value="Fitness Wear" className="bg-zinc-900">{t("contact.catFitness")}</option>
                        <option value="Casual Wear" className="bg-zinc-900">{t("contact.catCasual")}</option>
                        <option value="Custom OEM" className="bg-zinc-900">{t("contact.catOem")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.quantity")}</label>
                      <input suppressHydrationWarning placeholder={t("contact.placeholders.quantity")} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("contact.labels.message")}</label>
                    <textarea suppressHydrationWarning rows={4} placeholder={t("contact.placeholders.message")} value={form.message} onChange={(e) => set("message", e.target.value)} className={`${inputCls} resize-none`} />
                  </div>
                  <button type="submit"
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500">
                    <MessageCircle className="h-4 w-4" />
                    {t("contact.submitWa")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>
                  <p className="text-center text-[10px] text-zinc-600">{t("contact.waHint", { send: t("common.send") })}</p>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />{t("contact.faqEyebrow")}</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">{t("contact.faqTitle")}</h2></FadeUp>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="rounded-xl border border-white/[0.07] bg-zinc-900/60 p-6">
                  <h3 className="mb-2 text-sm font-bold text-white">{t(`contact.faqItems.${i}.q`)}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{t(`contact.faqItems.${i}.a`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
