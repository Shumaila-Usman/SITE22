"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Intro } from "@/components/intro";
import { Hero } from "@/components/hero";
import {
  StatsStrip,
  AboutPreview,
  ProductShowcase,
  WhyChooseUs,
  OEMSection,
  ProcessFlow,
  MOQSection,
  QualitySection,
  BuyerTrustSection,
  TestimonialsSection,
  FAQSection,
  ContactPreview,
  CTASection,
} from "@/components/sections";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Heavy overshoot — like something heavy landing
const SLAM: [number, number, number, number] = [0.22, 1.15, 0.36, 1];

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);
    // Show intro on all devices once per session.
    if (!sessionStorage.getItem("mci_intro_done")) {
      setShowIntro(true);
    } else {
      setReady(true);
    }
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem("mci_intro_done", "1");
    setShowIntro(false);
    setReady(true);
  }

  return (
    <>
      {/* Intro — all devices (once per session) */}
      <AnimatePresence>
        {showIntro && <Intro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Site content */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: isDesktop ? 0.5 : 0, ease: EASE }}
      >
        {/* Hero */}
        <div className="w-full">
          <motion.div
            className="w-full"
            initial={{ y: isDesktop ? "-80px" : 0, opacity: 0, filter: isDesktop ? "blur(10px)" : "blur(0px)" }}
            animate={ready ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: isDesktop ? 1.0 : 0, ease: SLAM, delay: isDesktop ? 0.05 : 0 }}
          >
            <Hero />
          </motion.div>
        </div>

        {/* Rest of page */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: isDesktop ? 30 : 0 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isDesktop ? 0.8 : 0, ease: EASE, delay: isDesktop ? 0.55 : 0 }}
        >
          <StatsStrip />
          <AboutPreview />
          <ProductShowcase />
          <WhyChooseUs />
          <OEMSection />
          <ProcessFlow />
          <MOQSection />
          <QualitySection />
          <BuyerTrustSection />
          <TestimonialsSection />
          <FAQSection />
          <ContactPreview />
          <CTASection />
        </motion.div>
      </motion.div>
    </>
  );
}
