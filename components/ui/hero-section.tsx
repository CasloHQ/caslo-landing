"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { LightRays } from "@/components/ui/light-rays";
import { Canvas } from "@react-three/fiber";
import ModelSlider, {
  MODELS,
  MODELS_COUNT,
} from "@/components/ui/model-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";

type Props = {
  imageSrc?: string; // fallback
};

export default function HeroSection({
  imageSrc = "/images/workshop-new-bg.jpg",
}: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);

  // Background crossfade
  const [currentBg, setCurrentBg] = useState(MODELS[0]?.bg ?? imageSrc);
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [nextBgVisible, setNextBgVisible] = useState(false);

  // Mouse parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const bgTransform = `translate(${mouse.x * 12}px, ${mouse.y * 8}px) scale(1.04)`;

  const change = (dir: -1 | 1) => {
    if (locked) return;
    setLocked(true);
    setVisible(false);

    const nextIndex = (index + dir + MODELS_COUNT) % MODELS_COUNT;
    const nextBackground = MODELS[nextIndex]?.bg ?? imageSrc;

    setNextBg(nextBackground);
    setNextBgVisible(false);
    requestAnimationFrame(() => setNextBgVisible(true));

    setTimeout(() => {
      setIndex(nextIndex);
      setVisible(true);

      setTimeout(() => {
        setCurrentBg(nextBackground);
        setNextBg(null);
        setNextBgVisible(false);
        setLocked(false);
      }, 450);
    }, 350);
  };

  const meta = MODELS[index];

  return (
    <section
      className="relative w-full h-dvh overflow-hidden bg-black select-none"
      style={{ fontFamily: "var(--font-aboreto)" }} // default Aboreto for hero
    >
      {/* Base background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 will-change-transform transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${currentBg})`,
          transform: bgTransform,
        }}
      />

      {/* Next background fades in */}
      {nextBg && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-0 will-change-transform transition-opacity duration-[450ms] ease-out ${
            nextBgVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${nextBg})`,
            transform: bgTransform,
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35 z-[1]" />

      {/* Light Rays */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-60">
        <LightRays />
      </div>

      {/* Orbiting Circles (hidden for now) */}
      <div className="absolute inset-0 opacity-0 z-10">
        <OrbitingCircles radius={200} className="h-full w-full">
          <Image src="/iconNew_1.png" width={40} height={40} alt="" />
        </OrbitingCircles>

        <OrbitingCircles radius={400} reverse className="h-full w-full">
          <Image src="/iconNew_2.png" width={50} height={50} alt="" />
        </OrbitingCircles>

        <OrbitingCircles radius={600} className="h-full w-full">
          <Image src="/iconNew_3.png" width={70} height={70} alt="" />
        </OrbitingCircles>
      </div>

      {/* LEFT arrow */}
      <button
        onClick={() => change(-1)}
        aria-label="Previous model"
        className="group absolute left-7 md:left-14 top-1/2 -translate-y-1/2 z-40 p-2 isolate"
      >
        <ChevronLeft
          className="
            h-6 w-6 md:h-8 md:w-8
            text-white/90
            transition-all duration-300
            group-hover:text-white
            group-hover:scale-110
            group-hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.9)]
            active:scale-95
          "
        />
      </button>

      {/* RIGHT arrow */}
      <button
        onClick={() => change(1)}
        aria-label="Next model"
        className="group absolute right-7 md:right-14 top-1/2 -translate-y-1/2 z-40 p-2 isolate"
      >
        <ChevronRight
          className="
            h-6 w-6 md:h-8 md:w-8
            text-white/90
            transition-all duration-300
            group-hover:text-white
            group-hover:scale-110
            group-hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.9)]
            active:scale-95
          "
        />
      </button>

      {/* 3D MODEL */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start z-20">
        <div className="w-80 h-80 md:w-[520px] md:h-[520px] md:ml-[240px] bg-transparent">
          <Canvas
            shadows
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={1.2} />

            <directionalLight
              position={[5, 5, 5]}
              intensity={4}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-radius={8}
            />

            <directionalLight position={[-5, 3, 2]} intensity={3} />

            {/* Shadow plane */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -2.3, 0]}
              receiveShadow
            >
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.22} />
            </mesh>

            <ModelSlider index={index} visible={visible} />
          </Canvas>
        </div>
      </div>

      {/* TEXT PANEL (RIGHT) */}
      <div
        className={`absolute right-6 md:right-[280px] top-1/2 -translate-y-1/2 z-30 max-w-md transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-[#d7b26b] tracking-[0.18em] text-2xl md:text-4xl">
          {meta.title}
        </h1>

        <p className="mt-3 italic text-white/75 text-base md:text-lg">
          {meta.tagline}
        </p>

        {/* Description in Noto Serif ONLY */}
        <p
          className="mt-5 text-white/65 leading-relaxed text-sm md:text-base"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
          {meta.description}
        </p>

        {/* Breadcrumb buttons */}
        <div className="mt-8 flex gap-6 ml-[-10px]">
          <div className="flex items-center gap-3">
            <span className="text-white/55 text-lg"></span>
            <RainbowButton className="px-6 py-2 !text-white">
              COLLECTION
            </RainbowButton>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/55 text-lg"></span>
            <RainbowButton className="px-6 py-2 !text-white">
              STATUE
            </RainbowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
