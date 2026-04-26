"use client";

import Image from "next/image";
import type { GarmentSide, SideDesignConfig } from "@/lib/customization-types";
import { SIDE_LABELS } from "@/lib/customization-types";

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function GarmentPreviewPanel({
  imageUrl,
  activeSide,
  config,
}: {
  imageUrl: string;
  activeSide: GarmentSide;
  config: SideDesignConfig;
}) {
  const st = config.stripes;

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_minmax(200px,300px)]">
      <div className="relative flex min-h-[200px] items-center justify-center rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-3 sm:min-h-[260px] sm:p-6 lg:min-h-[300px]">
        <div className="relative aspect-[3/4] w-full max-w-md">
          <Image
            src={imageUrl}
            alt={`${SIDE_LABELS[activeSide]} garment`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 45vw"
            unoptimized
          />
        </div>
        <span className="absolute left-2 top-2 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-red-300 sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.15em]">
          {SIDE_LABELS[activeSide]}
        </span>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-black/35 p-3 text-[11px] text-zinc-300 sm:p-4 sm:text-xs">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-red-400 sm:mb-3 sm:text-[10px] sm:tracking-[0.22em]">
          Settings · {SIDE_LABELS[activeSide]}
        </p>
        <dl className="space-y-2 sm:space-y-2.5">
          <div>
            <dt className="text-[10px] text-zinc-500">Colors</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5 sm:gap-2">
              {[
                ["Primary", config.primaryColor],
                ["Secondary", config.secondaryColor],
                ["Accent", config.accentColor],
              ].map(([label, hex]) => (
                <span
                  key={label as string}
                  className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-1 sm:gap-1.5 sm:px-2"
                >
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/15" style={{ backgroundColor: hex as string }} />
                  <span className="shrink-0 text-zinc-400">{label}</span>
                  <span className="hidden font-mono text-[9px] text-zinc-600 sm:inline sm:text-[10px]">{hex as string}</span>
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-zinc-500">Stripes</dt>
            <dd className="mt-1 text-zinc-300">
              {st.enabled ? (
                <span>
                  On · {cap(st.position)} · {cap(st.thickness)} · {st.color}
                </span>
              ) : (
                <span className="text-zinc-500">Off</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-zinc-500">Name / Number</dt>
            <dd className="mt-1 text-white">
              {[config.customText || "—", config.customNumber || "—"].join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-zinc-500">Logo</dt>
            <dd className="mt-1">
              {config.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.logoUrl} alt="" className="h-10 w-10 rounded border border-white/10 bg-zinc-900 object-contain" />
              ) : (
                <span className="text-zinc-500">None</span>
              )}
            </dd>
          </div>
          {config.notes ? (
            <div>
              <dt className="text-[10px] text-zinc-500">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap text-zinc-400">{config.notes}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
