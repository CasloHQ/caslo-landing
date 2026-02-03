"use client";

import React, { useMemo } from "react";

type Card = {
  id: string;
  src: string;
  poster?: string;
};

type ColumnProps = {
  items: Card[];
  direction: "up" | "down";
  durationSec?: number;
};

function ColumnMarquee({ items, direction, durationSec = 14 }: ColumnProps) {
  // Duplicate items to enable seamless loop
  const trackItems = useMemo(() => [...items, ...items], [items]);

  const anim = direction === "up" ? "marquee-up" : "marquee-down";

  return (
    <div className="relative h-full overflow-hidden">
      {/* soft top/bottom fade like your reference */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10" />

      <div
        className="will-change-transform"
        style={{
          animation: `${anim} ${durationSec}s linear infinite`,
        }}
      >
        <div className="flex flex-col gap-6 py-6">
          {trackItems.map((v, idx) => (
            <div
              key={`${v.id}-${idx}`}
              className="
                relative overflow-hidden rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                bg-neutral-200
                h-[110px] sm:h-[120px] md:h-[132px]
              "
            >
              <video
                src={v.src}
                poster={v.poster}
                muted
                playsInline
                preload="metadata"
                autoPlay
                loop
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* subtle gloss */}
              <div className="absolute inset-0 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VideoGridMarqueeSection() {
  // Replace these with your real videos
  const col1: Card[] = useMemo(
    () => [
      {
        id: "c1-1",
        src: "/videos/video-1.mp4",
        poster: "/video-thumbs/thumb-1.jpg",
      },
      {
        id: "c1-2",
        src: "/videos/video-2.mp4",
        poster: "/video-thumbs/thumb-2.jpg",
      },
      {
        id: "c1-3",
        src: "/videos/video-3.mp4",
        poster: "/video-thumbs/thumb-3.jpg",
      },
      {
        id: "c1-4",
        src: "/videos/video-1.mp4",
        poster: "/video-thumbs/thumb-1.jpg",
      },
    ],
    [],
  );

  const col2: Card[] = useMemo(
    () => [
      {
        id: "c2-1",
        src: "/videos/video-2.mp4",
        poster: "/video-thumbs/thumb-2.jpg",
      },
      {
        id: "c2-2",
        src: "/videos/video-3.mp4",
        poster: "/video-thumbs/thumb-3.jpg",
      },
      {
        id: "c2-3",
        src: "/videos/video-1.mp4",
        poster: "/video-thumbs/thumb-1.jpg",
      },
      {
        id: "c2-4",
        src: "/videos/video-2.mp4",
        poster: "/video-thumbs/thumb-2.jpg",
      },
    ],
    [],
  );

  const col3: Card[] = useMemo(
    () => [
      {
        id: "c3-1",
        src: "/videos/video-3.mp4",
        poster: "/video-thumbs/thumb-3.jpg",
      },
      {
        id: "c3-2",
        src: "/videos/video-1.mp4",
        poster: "/video-thumbs/thumb-1.jpg",
      },
      {
        id: "c3-3",
        src: "/videos/video-2.mp4",
        poster: "/video-thumbs/thumb-2.jpg",
      },
      {
        id: "c3-4",
        src: "/videos/video-3.mp4",
        poster: "/video-thumbs/thumb-3.jpg",
      },
    ],
    [],
  );

  return (
    <section className="relative w-full min-h-dvh bg-white overflow-hidden flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 h-[70vh] md:h-[78vh]">
          {/* Left column: DOWN */}
          <ColumnMarquee items={col1} direction="down" durationSec={16} />
          {/* Middle column: UP */}
          <ColumnMarquee items={col2} direction="up" durationSec={14} />
          {/* Right column: DOWN */}
          <ColumnMarquee items={col3} direction="down" durationSec={18} />
        </div>

        {/* Button like ref */}
        <div className="mt-10 flex items-center justify-center">
          <button
            className="
              rounded-full px-6 py-2
              bg-[#e3b36b] text-black
              text-sm tracking-[0.12em]
              shadow-[0_12px_40px_rgba(0,0,0,0.12)]
              hover:brightness-105 active:scale-[0.98]
              transition
              [font-family:var(--font-aboreto)]
            "
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
}
