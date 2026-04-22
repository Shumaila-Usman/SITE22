import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse Megacore International's full sportswear catalog — Sports Wear, Fitness Wear, and Casual Wear. MOQ 50 pieces.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
