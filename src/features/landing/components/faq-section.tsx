"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiPlus, HiMinus } from "react-icons/hi";

const FAQS = [
  {
    question: "Who is Elimi LMS for?",
    answer:
      "Elimi LMS is designed for Nigerian artisans, trade apprentices, site technicians, and vocational learners seeking structured, NSQ-aligned training to upgrade their craft, earn digital certificates, and prepare for physical competency assessment on Elimi CAP.",
  },
  {
    question: "How is Elimi LMS different from other learning platforms?",
    answer:
      "Unlike generic platforms, Elimi LMS specifically focuses on accredited TVET skilled trades (Electrical, Plumbing, Carpentry, Masonry, Welding, Solar PV). Our curriculum directly mirrors National Occupational Standards and provides a direct bridge to physical evaluation at accredited CAP test centres.",
  },
  {
    question: "Can I learn on my mobile phone?",
    answer:
      "Yes! The entire platform is built mobile-first and optimized for low data consumption. You can watch short video demonstrations, review illustrated technical guides, and complete quizzes directly on any smartphone.",
  },
  {
    question: "Do I get a certificate for completing a course?",
    answer:
      "Yes. Upon completing all modules and passing knowledge checks, you receive a verifiable Coursework Certificate of Completion. You can present this to clients, contractors, or use it as proof of theoretical mastery when applying for CAP assessment.",
  },
  {
    question: "How does this connect to Elimi CAP (Competency Assessment Platform)?",
    answer:
      "Elimi LMS covers the essential theory, safety codes, and calculation procedures. Once complete, your dashboard guides you to schedule your hands-on physical assessment at an accredited centre through Elimi CAP to earn formal NBTE National Skills Qualifications.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="w-full py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#241014] text-center tracking-tight">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-primary-solid bg-white shadow-sm ring-1 ring-primary-solid/20"
                    : "border-neutral-200/80 bg-white hover:border-neutral-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#241014]"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen ? "bg-primary-solid text-white" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {isOpen ? <HiMinus className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/register"
            className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-7 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Ask another question
          </Link>
        </div>
      </div>
    </section>
  );
};
