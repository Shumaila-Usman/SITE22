import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Policy",
  description: "MOQ, payment terms, sampling policy, and order conditions for Megacore International.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
