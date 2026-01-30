"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/ui/NavBar";
import HeroSection from "@/components/ui/hero-section";
import VideoSliderSection from "@/components/ui/VideoSliderSection";

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Hide navbar once hero is less visible (tweak 0.65 if needed)
        setHideNav(!(entry.isIntersecting && entry.intersectionRatio > 0.65));
      },
      { threshold: [0, 0.35, 0.65, 1] },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main
      className="
        relative w-full h-dvh overflow-y-auto overflow-x-hidden
        snap-y snap-mandatory scroll-smooth
      "
    >
      <NavBar hidden={hideNav} />

      {/* HERO */}
      <section ref={heroRef} className="snap-start h-dvh">
        <HeroSection />
      </section>

      {/* VIDEO */}
      <section className="snap-start min-h-dvh">
        <VideoSliderSection />
      </section>
    </main>
  );
}
