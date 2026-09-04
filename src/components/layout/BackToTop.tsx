"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Back to top"
      className="glass-button fixed bottom-6 right-6 z-40 rounded-full p-3 text-slate-800 shadow-lg"
    >
      ↑
    </motion.button>
  );
}
