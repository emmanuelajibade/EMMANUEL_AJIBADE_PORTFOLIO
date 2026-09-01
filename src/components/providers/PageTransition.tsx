"use client";

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, scale: 1.02, filter: "blur(6px)" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[70vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}