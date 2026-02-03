"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/ui/NavBar";
import HeroSection from "@/components/ui/hero-section";
import TextSliderSection from "@/components/ui/TextSliderSection";
import VideoSliderSection from "@/components/ui/VideoSliderSection";
import VideoGridMarqueeSection from "@/components/ui/VideoGridMarqueeSection";
export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setHideNav(entry.intersectionRatio < 0.75),
      { rootMargin: "-8% 0px -8% 0px", threshold: [0, 0.75, 1] },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main
      className="
        relative w-full h-dvh overflow-y-auto overflow-x-hidden
        snap-y snap-mandatory
        [scroll-snap-stop:always]
        [overscroll-behavior-y:contain]
        [scrollbar-gutter:stable]
      "
    >
      <NavBar hidden={hideNav} />

      {/* HERO */}
      <section ref={heroRef} className="snap-start h-dvh">
        <HeroSection />
      </section>

      {/* TEXT SLIDER */}
      <section className="snap-start h-dvh">
        <TextSliderSection />
      </section>

      {/* VIDEO */}
      <section className="snap-start h-dvh">
        <VideoSliderSection />
      </section>

      <section className="snap-start min-h-dvh">
        <VideoGridMarqueeSection />
      </section>
    </main>
  );
}
