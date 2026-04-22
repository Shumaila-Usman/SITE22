import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved products. Proceed to discussion via WhatsApp with your selected items.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
