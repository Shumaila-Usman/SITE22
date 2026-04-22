import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Manufacturing & OEM",
  description: "Full OEM and private label sportswear manufacturing. Custom logos, fabrics, packaging, and export-ready delivery.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
