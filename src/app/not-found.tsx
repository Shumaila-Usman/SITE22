"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-black px-6 pt-28 text-center">
      <h1 className="mb-4 text-4xl font-black uppercase text-white">{t("notFound.title")}</h1>
      <p className="mb-8 max-w-md text-zinc-400">{t("notFound.body")}</p>
      <Link href="/" className="rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-500">
        {t("notFound.home")}
      </Link>
    </main>
  );
}
