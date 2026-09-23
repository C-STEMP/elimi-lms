"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FiSmartphone, FiAward, FiCheckCircle, FiShield } from "react-icons/fi";

const BENEFITS = [
  {
    icon: FiSmartphone,
    title: "Mobile-First & Low Data Consumption",
    description:
      "Crafted for working tradesmen. Access your courses anywhere on any smartphone without chewing through mobile data.",
  },
  {
    icon: FiAward,
    title: "National Occupational Standards (NOS)",
    description:
      "Curriculum calibrated with NBTE and national awarding bodies. What you study reflects the real-world skills tested in CAP labs.",
  },
  {
    icon: FiCheckCircle,
    title: "Practice Quizzes & Instant Feedback",
    description:
      "Test your understanding after every video and manual module. Reinforce safety codes, formulas, and tool applications.",
  },
  {
    icon: FiShield,
    title: "Direct Readiness for CAP Assessment",
    description:
      "Candidates who complete LMS modules show higher pass rates in hands-on practical evaluations conducted at CAP test centres.",
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="bg-[#f9fafb] py-16 lg:py-24 border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Real Artisan Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-96 sm:h-112 lg:h-128 w-full overflow-hidden rounded-2xl shadow-xl border border-neutral-200">
              <Image
                src="/landing-img-1.jpg"
                alt="Nigerian craftsman artisan measuring wood in workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <blockquote className="text-sm sm:text-base font-medium leading-snug">
                  &ldquo;Completing the electrical modules before my assessment centre test made all
                  the difference. I walked in knowing the standards inside out.&rdquo;
                </blockquote>
                <cite className="mt-2 block text-xs font-bold text-[#FBCB7C] tracking-wide not-italic">
                  Emmanuel Adeyemi · Electrical Apprentice, Lagos
                </cite>
              </div>
            </div>
          </div>

          {/* Right Column: Key Benefits */}
          <div className="lg:col-span-7 lg:pl-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AA1D3F]">
              Why Elimi LMS
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#241014] tracking-tight">
              E-Learning Built Specially for the Skilled Trades
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Traditional vocational training often leaves gaps in theoretical principles, safety
              regulations, and technical drawings. Elimi LMS delivers structured, certified trade
              education designed to make every artisan competent and competitive.
            </p>

            {/* 2x2 Benefits Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BENEFITS.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#AA1D3F]/10 text-[#AA1D3F] mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#241014]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#AA1D3F] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#8F1532] shadow"
              >
                <span>Register As A Learner</span>
                <HiOutlineCheckCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
