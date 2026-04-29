import type { Metadata } from "next";
import { TermsContent } from "./terms-content";

export const metadata: Metadata = {
  title: "Terms & Policy | Megacore International",
  description:
    "MOQ, payment terms, sampling policy, production lead times, and order conditions for Megacore International.",
};

export default function TermsPage() {
  return <TermsContent />;
}
