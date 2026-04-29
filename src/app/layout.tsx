import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ConditionalShell } from "@/components/conditional-shell";

export const metadata: Metadata = {
  title: {
    default: "Megacore International | Sportswear Manufacturer & Exporter",
    template: "%s | Megacore International",
  },
  description:
    "Premium sportswear manufacturer and exporter based in Pakistan. Custom manufacturing, OEM, private label. MOQ 50 pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
