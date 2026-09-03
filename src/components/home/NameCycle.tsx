"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const nameVariants = [
  "Emmanuel Ajibade",
  "Emmanuel Aduragbemi Ajibade",
  "Ajibade Emmanuel",
  "E. A. Ajibade",
];

export default function NameCycle({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % nameVariants.length);
    }, 120000);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  const value = prefersReducedMotion ? "Emmanuel Ajibade" : nameVariants[activeIndex];

  return (
    <span aria-hidden="true" className={className}>
      {value}
    </span>
  );
}
