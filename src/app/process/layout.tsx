import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MOQ & Order Process",
  description: "MOQ 50 pieces. Clear payment terms, sampling policy, production lead times, and export process for Megacore International orders.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
