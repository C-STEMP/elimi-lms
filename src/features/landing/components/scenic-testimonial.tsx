"use client";

import React from "react";
import Image from "next/image";
import { BiSolidQuoteLeft } from "react-icons/bi";

export const ScenicTestimonial: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="relative mx-auto max-w-7xl min-h-95 sm:min-h-115 rounded-[28px] sm:rounded-[36px] overflow-hidden flex items-center justify-center p-6 sm:p-12 shadow-md">
        <Image
          src="/hero-img-4.jpg"
          alt="Scenic field background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-xl rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl border border-white/40 text-left">
          <BiSolidQuoteLeft className="h-8 w-8 text-primary-solid/30 mb-3" />

          <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-primary leading-relaxed">
            &ldquo;Elimi completely changed how I approach trade training. I
            feel more focused, less pressured, and walked into my CAP physical
            assessment knowing all the safety checks and formulas.&rdquo;
          </p>

          <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-neutral-100">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-primary-solid bg-neutral-200">
              <Image
                src="/hero-img-2.jpg"
                alt="Tunde Balogun"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-primary">Tunde Balogun</p>
              <p className="text-xs text-neutral-500 font-medium">
                Master Carpenter · Certified via Elimi CAP
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
