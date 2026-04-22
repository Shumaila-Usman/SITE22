import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
