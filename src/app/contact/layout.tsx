import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send your inquiry to Megacore International. We respond within 24 hours. WhatsApp, email, and inquiry form available.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
