"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Intro } from "@/components/intro";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const KEY = "mci_intro_done";

export function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) {
      setShow(false);
      setDone(true);
    } else {
      setShow(true);
    }
  }, []);

  function handleComplete() {
    sessionStorage.setItem(KEY, "1");
    setDone(true);
  }

  if (show === null) return <div style={{ opacity: 0 }}>{children}</div>;

  return (
    <>
      {show && <Intro onComplete={handleComplete} />}
      <motion.div
        initial={{ opacity: 0, y: show ? 24 : 0 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
