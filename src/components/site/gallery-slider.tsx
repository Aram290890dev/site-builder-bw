"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GallerySliderProps {
  images: string[];
  accentColor: string;
  imgRadius: string;
  aspectRatio: string;
}

export function GallerySlider({ images, accentColor, imgRadius, aspectRatio }: GallerySliderProps) {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="mx-auto max-w-4xl">
    <div className="relative overflow-hidden rounded-2xl" style={{ borderRadius: imgRadius }}>
      {/* Main image */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full shrink-0">
              <img
                src={img}
                alt={`Photo ${i + 1}`}
                className="w-full object-cover"
                style={{ aspectRatio: aspectRatio || "16/10", maxHeight: "480px", borderRadius: imgRadius }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Previous / Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="size-2.5 rounded-full transition-all"
              style={{
                backgroundColor: i === current ? accentColor : "rgba(255,255,255,0.5)",
                transform: i === current ? "scale(1.25)" : "scale(1)",
              }}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 2 && (
        <div className="mt-2 flex justify-center gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="shrink-0 overflow-hidden transition-all"
              style={{
                width: 72,
                height: 48,
                borderRadius: "0.375rem",
                opacity: i === current ? 1 : 0.5,
                outline: i === current ? `2px solid ${accentColor}` : "2px solid transparent",
                outlineOffset: "1px",
              }}
            >
              <img src={img} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
