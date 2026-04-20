import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-red-400/20 bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(127,29,29,0.8),rgba(9,9,11,0.95)_42%,rgba(136,19,55,0.7))]" />
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
      <div className="noise-overlay" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-200">
            Megacore International
          </h3>
          <p className="mt-3 text-sm text-zinc-400">
            Precision sportswear manufacturing and export infrastructure for
            performance-focused global brands.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Navigate</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
            <Link className="transition hover:text-red-300" href="/products">
              Products
            </Link>
            <Link className="transition hover:text-red-300" href="/capabilities">
              Capabilities
            </Link>
            <Link className="transition hover:text-red-300" href="/process">
              Order Process
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Connect</p>
          <p className="mt-3 text-sm text-zinc-300">export@megacoreintl.com</p>
          <p className="text-sm text-zinc-300">+92 300 000 0000</p>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-3 text-center text-xs uppercase tracking-[0.2em] text-zinc-500">
        Megacore International // Engineered For Global Performance
      </div>
    </footer>
  );
}
