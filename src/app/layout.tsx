import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en" className="dark">
      <body suppressHydrationWarning>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
