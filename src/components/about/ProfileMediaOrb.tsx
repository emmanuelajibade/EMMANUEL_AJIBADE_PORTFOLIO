"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

export default function ProfileMediaOrb({ items }: { items: MediaItem[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!items.length || items[current]?.type === "video") return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current, items.length, items[current]?.type]);

  if (!items.length) return null;

  const item = items[current];

  return (
    <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-white/50 shadow-2xl bg-slate-900 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={{ objectFit: "cover" }}
              autoPlay
              muted
              playsInline
              onEnded={() => setCurrent((prev) => (prev + 1) % items.length)}
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