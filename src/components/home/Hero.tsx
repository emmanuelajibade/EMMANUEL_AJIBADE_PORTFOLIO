"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { Profile } from "@/types/content";
import Container from "@/components/layout/Container";
import MagneticButton from "@/components/layout/MagneticButton";
import NameCycle from "@/components/home/NameCycle";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Subtle background glow */}
      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-0 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/30 blur-3xl"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, 18, -12, 0],
                y: [0, -10, 16, 0],
                scale: [1, 1.15, 0.96, 1],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container>
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          className="glass-panel-strong mx-auto max-w-4xl rounded-[32px] p-6 sm:p-8 lg:p-12"
        >
          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600"
          >
            {profile.title}
          </motion.p>

          <motion.h1
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="gradient-text text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm"
            aria-hidden="true"
          >
            <NameCycle className="inline-block text-blue-600" />
          </motion.div>

          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700"
          >
            I build practical digital products with modern web technologies and bring a design-minded
            approach to the way they look, feel, and work.
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <MagneticButton href="/projects" variant="primary">
              View Projects
            </MagneticButton>
            <MagneticButton href="/design" variant="secondary">
              View Design Work
            </MagneticButton>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}