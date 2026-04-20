"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right";

const getInitial = (direction: Direction) => {
  if (direction === "left") return { opacity: 0, x: -30 };
  if (direction === "right") return { opacity: 0, x: 30 };
  return { opacity: 0, y: 24 };
};

export function AnimatedSection({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}) {
  return (
    <motion.section
      className={cn(className)}
      initial={getInitial(direction)}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}
