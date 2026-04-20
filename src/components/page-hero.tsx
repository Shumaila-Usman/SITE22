import { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="industrial-divider relative isolate overflow-hidden border-b border-white/10 bg-zinc-950/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(239,68,68,0.28),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:46px_46px] opacity-20" />
      <div className="noise-overlay" />
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.24em] text-red-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-zinc-300">{description}</p>
        {children}
      </div>
    </section>
  );
}
