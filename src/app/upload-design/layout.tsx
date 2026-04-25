import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Your Design | Megacore International",
  description:
    "Upload your own custom apparel design and send it for production discussion. Jerseys, tracksuits, hoodies, and more — manufactured to your exact specification.",
};

export default function UploadDesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
