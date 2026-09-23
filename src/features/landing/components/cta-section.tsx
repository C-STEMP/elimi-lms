"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

export const CtaSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#661126] py-16 lg:py-20 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-3/4 rounded-full bg-primary/40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FBCB7C] mb-4">
          Start Your Trade Journey Today
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Ready to Upgrade Your Skills &amp; <br />
          <span className="text-[#FBCB7C]">Become a Certified Artisan</span>?
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/85 leading-relaxed">
          Sign up for free, pick your trade specialization, and begin modular lessons right now.
          Prepare for practical assessment on Elimi CAP and unlock higher earnings.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-neutral-primary transition-all hover:bg-secondary-hover hover:shadow-lg active:scale-95"
          >
            <span>Create Learner Account</span>
            <HiOutlineArrowNarrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            <span>Sign In to Dashboard</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
