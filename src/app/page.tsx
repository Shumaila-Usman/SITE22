import { Hero } from "@/components/hero";
import {
  CTASection,
  ProcessFlow,
  ProductShowcase,
  StatsStrip,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ProductShowcase />
      <ProcessFlow />
      <CTASection />
    </>
  );
}
