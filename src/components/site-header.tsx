"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300",
          isCompact ? "py-2.5" : "py-[1.125rem]",
        )}
      >
        <Link
          href="/"
          onClick={() => setIsCompact(true)}
          className="group flex items-center gap-2 font-bold uppercase"
        >
          <span
            className={cn(
              "rounded-sm bg-red-500 shadow-glow transition-all duration-300",
              isCompact ? "h-2.5 w-2.5" : "h-3.5 w-3.5",
            )}
          />
          <span
            className={cn(
              "tracking-[0.25em] text-zinc-200 transition-all duration-300",
              isCompact ? "text-xs" : "text-sm",
            )}
          >
            Megacore
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-white",
                pathname === link.href && "text-red-400",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button size="sm">Request Quote</Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-6 w-6 text-zinc-200" />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-zinc-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-widest text-zinc-200"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
