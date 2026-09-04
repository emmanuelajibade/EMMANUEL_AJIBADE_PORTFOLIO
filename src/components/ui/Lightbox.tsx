"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const image = images[activeIndex];

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && images.length > 1) {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
        setZoom(1);
      } else if (event.key === "ArrowRight" && images.length > 1) {
        setActiveIndex((index) => (index + 1) % images.length);
        setZoom(1);
      } else if (event.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-lightbox="true"] button:not([disabled])',
          ),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  if (!image) return null;

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.min(3, Math.max(1, nextZoom)));
  };

  return (
    <div
      data-lightbox="true"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.div
          key={image.src}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
        >
          <motion.div
            drag={zoom > 1}
            dragConstraints={{ left: -240, right: 240, top: -180, bottom: 180 }}
            animate={{ scale: zoom }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="relative h-full w-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="select-none object-contain"
              unoptimized
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <div className="absolute right-0 top-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateZoom(zoom - 0.5)}
            disabled={zoom === 1}
            className="glass-button rounded-full px-3 py-2 text-lg text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => updateZoom(zoom + 0.5)}
            disabled={zoom === 3}
            className="glass-button rounded-full px-3 py-2 text-lg text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="glass-button rounded-full px-3 py-2 text-xl text-slate-800"
            aria-label="Close image viewer"
          >
            ×
          </button>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setActiveIndex((index) => (index - 1 + images.length) % images.length);
                setZoom(1);
              }}
              className="glass-button absolute left-0 rounded-full px-4 py-3 text-xl text-slate-800"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveIndex((index) => (index + 1) % images.length);
                setZoom(1);
              }}
              className="glass-button absolute right-0 rounded-full px-4 py-3 text-xl text-slate-800"
              aria-label="Next image"
            >
              →
            </button>
            <p className="absolute bottom-0 rounded-full bg-slate-950/60 px-3 py-1 text-sm text-white">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
