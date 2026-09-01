"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  const variantClass =
    variant === "primary"
      ? "glass-button-primary px-6 py-3 text-sm font-semibold text-white"
      : "glass-button px-6 py-3 text-sm font-semibold text-slate-800";

  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className={`${variantClass} ${className}`}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.a>
  );
}