"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox, { type LightboxImage } from "@/components/ui/Lightbox";

interface MediaItem {
  url: string;
  type: "image" | "video";
  altText?: string;
}

export default function MediaCarousel({ mediaItems, title }: { mediaItems: MediaItem[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const item = mediaItems[current];
  const imageItems: LightboxImage[] = mediaItems
    .filter((mediaItem) => mediaItem.type === "image")
    .map((mediaItem) => ({ src: mediaItem.url, alt: mediaItem.altText || title }));

  if (!item) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border border-border">
      <div className="relative aspect-video">
        {item.type === "video" ? (
          <video
            src={item.url}
            controls
            playsInline
            className="h-full w-full object-contain bg-black"
          />
        ) : (
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-in"
            onClick={() => setLightboxIndex(imageItems.findIndex((image) => image.src === item.url))}
            aria-label={`Open ${item.altText || title} in image viewer`}
          >
            <Image
              src={item.url}
              alt={item.altText || title}
              fill
              className="object-contain transition-transform duration-500 hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 70vw"
              unoptimized
            />
          </button>
        )}
      </div>

      {mediaItems.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            aria-label="Previous media"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % mediaItems.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            aria-label="Next media"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 rounded-full px-2 py-1">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full ${index === current ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to media ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      {lightboxIndex !== null && imageItems.length > 0 && (
        <Lightbox
          images={imageItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}