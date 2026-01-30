"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type VideoItem = {
  id: string;
  src: string;
  poster: string;
  title?: string;
};

type Phase =
  | "idle"
  | "expanding"
  | "playing"
  | "ended"
  | "shrinking"
  | "sliding";

const ENTER_MS = 700;
const SHRINK_MS = 480;

// SLIDE TUNING (this is the key)
const SLIDE_DISTANCE = 260; // px
const SLIDE_DURATION = 520; // ms
const SLIDE_EASE = "cubic-bezier(.2,.9,.25,1)";

function playWhenReady(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const tryPlay = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch {
      } finally {
        resolve();
      }
    };

    if (video.readyState >= 3) {
      void tryPlay();
      return;
    }

    const onCanPlay = () => void tryPlay();
    video.addEventListener("canplay", onCanPlay, { once: true });
    video.load();
  });
}

export default function VideoSliderSection() {
  const videos: VideoItem[] = useMemo(
    () => [
      {
        id: "v1",
        src: "/videos/videoNew-1.mp4",
        poster: "/video-thumbs/thumb-1.jpg",
        title: "UNIVERSAL",
      },
      {
        id: "v2",
        src: "/videos/video-2.mp4",
        poster: "/video-thumbs/thumb-2.jpg",
        title: "TIMELESS",
      },
      {
        id: "v3",
        src: "/videos/video-3.mp4",
        poster: "/video-thumbs/thumb-3.jpg",
        title: "MASTERPIECE",
      },
    ],
    [],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startedRef = useRef(false);
  const slideFinishArmed = useRef(false);

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageFull, setStageFull] = useState(false);
  const [muted, setMuted] = useState(true);

  // NEW: smooth slide state
  const [slideX, setSlideX] = useState(0);
  const [slideAnimating, setSlideAnimating] = useState(false);

  const prevIndex = (active - 1 + videos.length) % videos.length;
  const nextIndex = (active + 1) % videos.length;

  const prev = videos[prevIndex];
  const curr = videos[active];
  const next = videos[nextIndex];

  const start = async () => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = muted;
    setPhase("expanding");
    setStageFull(true);

    setTimeout(async () => {
      await playWhenReady(v);
      setPhase("playing");
    }, ENTER_MS);
  };

  const onEnded = () => setPhase("ended");

  // Auto-start on first view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (
          e.isIntersecting &&
          e.intersectionRatio > 0.4 &&
          !startedRef.current
        ) {
          startedRef.current = true;
          requestAnimationFrame(() => start());
        }
      },
      { threshold: [0, 0.4, 1] },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  useEffect(() => {
    videoRef.current?.load();
  }, [curr.src]);

  const goNext = () => {
    if (phase !== "ended") return;

    videoRef.current?.pause();

    // 1️⃣ shrink
    setPhase("shrinking");
    setStageFull(false);

    setTimeout(() => {
      // 2️⃣ slide
      setPhase("sliding");
      slideFinishArmed.current = true;
      setSlideAnimating(true);
      setSlideX(-SLIDE_DISTANCE);
    }, SHRINK_MS);
  };

  const onSlideEnd = () => {
    if (!slideFinishArmed.current) return;
    slideFinishArmed.current = false;

    // commit next
    setActive((i) => (i + 1) % videos.length);

    // reset WITHOUT animation
    setSlideAnimating(false);
    setSlideX(0);

    requestAnimationFrame(() => {
      setPhase("idle");
      start();
    });
  };

  const showPlayOverlay = phase !== "playing" && phase !== "ended";

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full min-h-dvh bg-white overflow-hidden
        flex items-center justify-center
        [font-family:var(--font-aboreto)]
      "
    >
      <div className="mx-auto max-w-6xl w-full px-6">
        <div className="relative h-[68vh] md:h-[72vh] min-h-[460px] max-h-[760px] flex items-center justify-center">
          {/* TRACK */}
          <div
            onTransitionEnd={onSlideEnd}
            className={[
              "absolute inset-0 flex items-center justify-center transform-gpu will-change-transform",
              slideAnimating
                ? `transition-transform duration-[${SLIDE_DURATION}ms]`
                : "transition-none",
            ].join(" ")}
            style={{
              transform: `translate3d(${slideX}px,0,0)`,
              transitionTimingFunction: SLIDE_EASE,
            }}
          >
            {/* LEFT */}
            <div className="hidden md:block -mr-28">
              <PreviewCard poster={prev.poster} />
            </div>

            {/* CENTER */}
            <div className="relative z-20">
              {/* MUTE */}
              <div className="absolute right-4 top-4 z-30">
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="rounded-full px-3 py-2 bg-black/40 text-white hover:bg-black/60 transition flex gap-2"
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="text-sm">{muted ? "Muted" : "Sound"}</span>
                </button>
              </div>

              {/* VIDEO CARD */}
              <div
                className={[
                  "relative overflow-hidden rounded-[36px]",
                  "shadow-[0_32px_110px_rgba(0,0,0,0.22)]",
                  "transition-transform ease-[cubic-bezier(.2,.8,.2,1)]",
                  stageFull
                    ? `scale-[1.18] duration-[${ENTER_MS}ms]`
                    : `scale-100 duration-[${SHRINK_MS}ms]`,
                  "w-[90vw] max-w-[920px] h-[330px] md:w-[920px] md:h-[500px]",
                ].join(" ")}
              >
                <video
                  ref={videoRef}
                  src={curr.src}
                  poster={curr.poster}
                  playsInline
                  muted={muted}
                  onEnded={onEnded}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute left-6 bottom-5 text-white">
                  <p className="text-sm opacity-70">Now playing</p>
                  <p className="text-lg font-semibold">{curr.title}</p>
                </div>

                {showPlayOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlayIcon />
                  </div>
                )}

                {phase === "ended" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={goNext}
                      className="rounded-full px-7 py-3 bg-white text-black font-medium shadow-lg hover:bg-neutral-100"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:block -ml-28">
              <PreviewCard poster={next.poster} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ poster }: { poster: string }) {
  return (
    <div className="w-[360px] h-[320px] rounded-[36px] overflow-hidden shadow-lg opacity-90">
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="h-full w-full bg-black/10 flex items-center justify-center">
          <PlayIcon small />
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ small }: { small?: boolean }) {
  return (
    <div
      className={[
        "rounded-full flex items-center justify-center bg-white/20",
        small ? "h-14 w-14" : "h-20 w-20",
      ].join(" ")}
    >
      <div
        className={
          small
            ? "ml-1 border-t-[11px] border-b-[11px] border-l-[18px] border-t-transparent border-b-transparent border-l-white/60"
            : "ml-1 border-t-[14px] border-b-[14px] border-l-[22px] border-t-transparent border-b-transparent border-l-white/80"
        }
      />
    </div>
  );
}
