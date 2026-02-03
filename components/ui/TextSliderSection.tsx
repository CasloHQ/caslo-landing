"use client";

import React from "react";
import { AuroraText } from "@/components/ui/aurora-text";
import { MorphingText } from "@/components/ui/morphing-text";

export default function TextSliderSection() {
  return (
    <section className="relative w-full h-dvh overflow-hidden bg-white">
      {/* Soft radial background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        {/* Move block slightly up */}
        <div className="flex flex-col items-center justify-center -mt-12 md:-mt-16 w-full px-6">
          {/* WE CREATE (small line) -> Aboreto */}
          <h2
            className="flex items-baseline justify-center gap-3
  text-4xl md:text-6xl
  font-semibold tracking-tight leading-none
  text-neutral-900"
            style={{ fontFamily: "var(--font-aboreto)" }}
          >
            <span>WE</span>
            <AuroraText className="font-semibold tracking-tight leading-none">
              CREATE
            </AuroraText>
          </h2>

          {/* Morphing line (BIG line) -> Poppins */}
          <div
            className="-mt-1 md:-mt-3 w-full flex items-center justify-center text-neutral-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <div className="relative flex w-full max-w-[1100px] items-center justify-center">
              <MorphingText
                texts={["arts", "crafts", "masterpieces"]}
                className="
        text-[88px] md:text-[150px]
        font-semibold tracking-tight
      "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
