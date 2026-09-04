"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import Image from "next/image";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface MediaAnimation {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
  exit: TargetAndTransition;
}

const animations: MediaAnimation[] = [
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
    if (items.length < 2) return;

    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % items.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const animation = animations[current % animations.length];

  return (
    <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white/50 bg-slate-900 shadow-2xl md:h-80 md:w-80">
      <div
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      >
        {items.map((preloadItem) =>
          preloadItem.type === "image" ? (
            <Image
              key={preloadItem.src}
              src={preloadItem.src}
              alt=""
              width={640}
              height={640}
              sizes="(max-width: 768px) 256px, 320px"
              loading="eager"
            />
          ) : (
            <video
              key={preloadItem.src}
              src={preloadItem.src}
              preload="auto"
              muted
              playsInline
            />
          ),
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={prefersReducedMotion ? false : animation.hidden}
          animate={prefersReducedMotion ? undefined : animation.visible}
          exit={prefersReducedMotion ? undefined : animation.exit}
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
              preload="auto"
              aria-label={item.alt || "Profile media"}
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt || "Profile media"}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              priority={current === 0}
              className="object-cover object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}