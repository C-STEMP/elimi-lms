"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { CapsuleNavbar } from "./capsule-navbar";

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="w-full p-0 m-0 relative h-[calc(100vh-36px)] min-h-145">
      <div className="relative w-full h-full overflow-hidden flex flex-col justify-between select-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/10 to-black/40 pointer-events-none" />

        <svg
          className="absolute inset-0 pointer-events-none w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 40 0 C 40 650, 400 900, 720 900 C 1040 900, 1400 650, 1400 0"
            stroke="white"
            strokeWidth="1.8"
            strokeDasharray="7 9"
            strokeOpacity="0.5"
          />
        </svg>

        <div className="w-full shrink-0 relative z-30">
          <CapsuleNavbar />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto pt-6 pb-6 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-[-0.03em] leading-[1.06] text-center">
            Learn skills that actually <br className="hidden sm:inline" />
            move you forward.
          </h1>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/95 font-normal leading-relaxed max-w-lg sm:max-w-xl mx-auto text-center">
            Explore new skills, follow clear learning paths, and grow at your
            own pace without pressure.
          </p>

          <div className="mt-7 sm:mt-9 flex items-center justify-center">
            <Link
              href="/register"
              className="rounded-full bg-white hover:bg-primary-solid hover:text-white text-neutral-900 px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xl active:scale-95 hover:shadow-2xl hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Bottom subtle anchor/spacer */}
        <div className="h-2 sm:h-4 shrink-0 relative z-10" />
      </div>
    </section>
  );
};
