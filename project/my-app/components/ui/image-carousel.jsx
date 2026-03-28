"use client";

import { useState } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from "react-icons/hi";

export default function ImageCarousel({
  images = [],
  compact = false,
  variant = "feed"
}) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return null;
  }

  const goPrevious = () => {
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goNext = () => {
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const heightClass =
    variant === "detail"
      ? "h-[24rem] sm:h-[30rem] lg:h-[38rem]"
      : compact
        ? "h-[18rem] sm:h-[24rem] lg:h-[30rem]"
        : "h-[22rem] sm:h-[28rem] lg:h-[34rem]";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
      <div className={`relative ${heightClass}`}>
        <img
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className="h-full w-full object-contain"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              <HiOutlineChevronLeft className="text-xl" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              <HiOutlineChevronRight className="text-xl" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/55 px-3 py-2 text-xs font-semibold text-white">
              <span>
                {index + 1}/{images.length}
              </span>
              <div className="flex gap-1.5">
                {images.map((image, itemIndex) => (
                  <button
                    key={`${image}-${itemIndex}`}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={`h-2 w-2 rounded-full transition ${
                      itemIndex === index ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Go to image ${itemIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
