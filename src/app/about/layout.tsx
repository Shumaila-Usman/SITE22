import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Megacore International — a Pakistan-based sportswear manufacturer and exporter serving global buyers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
