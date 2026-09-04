"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import Image from "next/image";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface AnimationSet {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
  exit: TargetAndTransition;
}

const animations: AnimationSet[] = [
  {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  },
];

export default function ProfileMediaOrb({ items }: { items: MediaItem[] }) {
  const [current, setCurrent] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const anim = animations[current % animations.length];

  return (
    <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-white/50 shadow-2xl bg-slate-900 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={prefersReducedMotion ? false : anim.hidden}
          animate={prefersReducedMotion ? undefined : anim.visible}
          exit={prefersReducedMotion ? undefined : anim.exit}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              className="h-full w-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt || "Profile media"}
              fill
              className="object-cover object-center"
              unoptimized
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}