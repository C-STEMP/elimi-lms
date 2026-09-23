"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FiBookOpen, FiCheckSquare, FiBriefcase } from "react-icons/fi";

const PATHWAY_STEPS = [
  {
    step: "01",
    id: "learn",
    title: "Learn on Elimi LMS",
    badge: "Current Platform",
    badgeColor: "bg-[#AA1D3F] text-white",
    icon: FiBookOpen,
    description:
      "Master the foundational theory, international safety codes, tools handling, and blueprint reading through modular, self-paced courses.",
    highlights: [
      "National Occupational Standards (NOS) curriculum",
      "Interactive trade videos & illustrated manuals",
      "Knowledge check quizzes with immediate feedback",
      "Earn verifiable Coursework Certificates",
    ],
    ctaText: "Start Learning",
    ctaLink: "/register",
    btnClass: "bg-[#AA1D3F] text-white hover:bg-[#8F1532]",
  },
  {
    step: "02",
    id: "assess",
    title: "Assess on Elimi CAP",
    badge: "Competency Assessment Platform",
    badgeColor: "bg-[#F9A825] text-[#241014]",
    icon: FiCheckSquare,
    description:
      "Put theory into practice. Elimi CAP connects you to accredited assessment centres where licensed assessors test your physical hands-on craft.",
    highlights: [
      "Physical practical test coordination across Nigeria",
      "NBTE TVET National Skills Qualification (NSQ)",
      "Rigorous QA Assessors, IQAs, and EQAs evaluation",
      "Recognition of Prior Learning (RPL) for seasoned artisans",
    ],
    ctaText: "Explore Assessment",
    ctaLink: "/register",
    btnClass: "bg-[#F9A825] text-[#241014] hover:bg-[#E0931B]",
  },
  {
    step: "03",
    id: "hired",
    title: "Get Hired & Work",
    badge: "WorkMaster Hub",
    badgeColor: "bg-neutral-900 text-white",
    icon: FiBriefcase,
    description:
      "Receive a tamper-proof digital trade ID. Corporate developers, construction firms, and homeowners verify your certified skills with 100% trust.",
    highlights: [
      "Fraud-free public artisan portfolio",
      "Direct matchmaking with major building projects",
      "Verified credentials backed by Awarding Bodies",
      "Continuous professional development tracking",
    ],
    ctaText: "Join Network",
    ctaLink: "/register",
    btnClass: "bg-neutral-900 text-white hover:bg-neutral-800",
  },
];

export const PathwaySection: React.FC = () => {
  return (
    <section id="pathway" className="bg-[#f4f5f8] py-16 lg:py-24 border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AA1D3F]">
            The Unified Trades Ecosystem
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#241014] tracking-tight">
            How <span className="text-[#AA1D3F]">Elimi LMS</span> Powers Your Journey into{" "}
            <span className="text-[#AA1D3F]">Elimi CAP</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Elimi integrates training and regulatory assessment into a continuous pipeline.
            Before stepping into a physical test centre, candidates build confidence and verify their
            trade theory right here on Elimi LMS.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PATHWAY_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative flex flex-col justify-between rounded-2xl bg-white p-6 lg:p-8 shadow-sm border border-neutral-200 transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-neutral-300 font-mono">
                      {step.step}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${step.badgeColor}`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-[#AA1D3F]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-[#241014]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="my-5 border-t border-neutral-100" />

                  <ul className="space-y-2 text-xs text-neutral-700">
                    {step.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#AA1D3F]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <Link
                    href={step.ctaLink}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all ${step.btnClass}`}
                  >
                    <span>{step.ctaText}</span>
                    <HiOutlineArrowNarrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
