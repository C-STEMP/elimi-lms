"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiStar } from "react-icons/hi";

type CourseItem = {
  id: string;
  title: string;
  badge: string;
  rating: string;
  description: string;
  instructor: string;
  instructorRole: string;
  category: string;
  pattern: "clover" | "tessellation" | "arcs" | "lenses" | "concentric" | "solar";
};

const COURSES: CourseItem[] = [
  {
    id: "leadership",
    title: "Strategic Trade Leadership & Contracting",
    badge: "Starts in 7 days",
    rating: "4.9 ( 789 Reviews )",
    description:
      "Develop leadership skills for trade business success. Learn project cost estimation, site management, and client negotiations.",
    instructor: "Raj Patel",
    instructorRole: "VP of Engineering & Technical Director",
    category: "Trending",
    pattern: "solar",
  },
  {
    id: "electrical",
    title: "Electrical Installation & Safety Fundamentals",
    badge: "Accredited Track",
    rating: "4.9 ( 321 Reviews )",
    description:
      "Master the core principles of single-phase wiring, conduit routing, circuit protection, and national IEE regulations.",
    instructor: "Dr. Anya Sharma",
    instructorRole: "Lead Technical Evaluator at NovaTech",
    category: "Electrical",
    pattern: "clover",
  },
  {
    id: "plumbing",
    title: "Plumbing & Sanitary Engineering Basics",
    badge: "Practical Prep",
    rating: "4.1 ( 567 Reviews )",
    description:
      "Get started with sanitary layouts, pipe sizing, hydrostatic pressure testing, and advanced drainage vent mechanics.",
    instructor: "Javier Rodriguez",
    instructorRole: "Chief Mechanical Trades Specialist at FutureTech",
    category: "Plumbing",
    pattern: "tessellation",
  },
  {
    id: "carpentry",
    title: "Roof Truss Framing & Architectural Joinery",
    badge: "High Demand",
    rating: "4.4 ( 456 Reviews )",
    description:
      "Develop precision timber joinery skills, load calculations, roofing geometry, and high-tolerance formwork fabrication.",
    instructor: "Kenji Tanaka",
    instructorRole: "Master Craftsman at Quantum Leap Innovations",
    category: "Carpentry",
    pattern: "arcs",
  },
  {
    id: "masonry",
    title: "Masonry, Blocklaying & Concrete Analytics",
    badge: "Foundational",
    rating: "4.2 ( 678 Reviews )",
    description:
      "Analyze structural masonry specifications. Learn mortar batch ratios, plumb line verticality, and damp-proof integration.",
    instructor: "Isabelle Dubois",
    instructorRole: "Director of Building Innovations at Stellaris Inc.",
    category: "Masonry",
    pattern: "lenses",
  },
  {
    id: "solar",
    title: "Solar PV Microgrid & Inverter Systems",
    badge: "Clean Energy",
    rating: "4.9 ( 412 Reviews )",
    description:
      "Design and install hybrid solar installations. Master panel orientation, battery storage, and safety disconnect procedures.",
    instructor: "Engr. Babatunde Lawal",
    instructorRole: "Senior Renewable Energy Inspector",
    category: "Solar PV",
    pattern: "concentric",
  },
];

const CATEGORIES = [
  "Trending",
  "Electrical",
  "Solar PV",
  "Plumbing",
  "Carpentry",
  "Masonry",
];

export const CoursesSection: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem>(COURSES[0]);
  const [activeCategory, setActiveCategory] = useState<string>("Trending");

  const handleCardClick = (course: CourseItem) => {
    setSelectedCourse(course);
    setActiveCategory(course.category);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    const matched = COURSES.find((c) => c.category === cat);
    if (matched) {
      setSelectedCourse(matched);
    }
  };

  const renderGraphicPattern = (pattern: CourseItem["pattern"]) => {
    switch (pattern) {
      case "clover":
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-4" fill="none">
            <circle cx="100" cy="70" r="30" fill="#ffffff" />
            <circle cx="75" cy="50" r="24" fill="#ffffff" opacity="0.9" />
            <circle cx="125" cy="50" r="24" fill="#ffffff" opacity="0.9" />
            <circle cx="75" cy="90" r="24" fill="#ffffff" opacity="0.9" />
            <circle cx="125" cy="90" r="24" fill="#ffffff" opacity="0.9" />
          </svg>
        );
      case "tessellation":
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-4" fill="none">
            <path
              d="M 100 20 L 100 120 M 50 70 L 150 70 M 65 35 L 135 105 M 65 105 L 135 35"
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="100" cy="70" r="16" fill="#ffffff" />
          </svg>
        );
      case "arcs":
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-3" fill="none">
            <path
              d="M 100 15 Q 100 70 45 70 Q 100 70 100 125 Q 100 70 155 70 Q 100 70 100 15 Z"
              fill="#ffffff"
            />
            <circle cx="100" cy="70" r="8" fill="#e5e7eb" />
          </svg>
        );
      case "lenses":
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-4" fill="none">
            <circle cx="70" cy="70" r="38" stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.9" />
            <circle cx="130" cy="70" r="38" stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.9" />
            <circle cx="100" cy="70" r="38" stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.6" />
          </svg>
        );
      case "concentric":
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-4" fill="none">
            <circle cx="100" cy="110" r="80" stroke="#ffffff" strokeWidth="12" fill="none" opacity="0.6" />
            <circle cx="100" cy="110" r="55" stroke="#ffffff" strokeWidth="12" fill="none" opacity="0.8" />
            <circle cx="100" cy="110" r="30" stroke="#ffffff" strokeWidth="12" fill="none" />
          </svg>
        );
      case "solar":
      default:
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full p-4" fill="none">
            <circle cx="100" cy="70" r="28" fill="#ffffff" />
            <path
              d="M 100 20 L 100 35 M 100 105 L 100 120 M 50 70 L 65 70 M 135 70 L 150 70 M 65 35 L 75 45 M 125 95 L 135 105 M 65 105 L 75 95 M 125 45 L 135 35"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  // Two identical copies for seamless looping translateX(-50%)
  const row1Items = [...COURSES, ...COURSES];
  const row2Items = [...COURSES, ...COURSES].reverse();

  return (
    <section id="courses" className="w-full pt-16 pb-12 sm:pt-20 sm:pb-16 bg-white relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#111827] tracking-tight leading-[1.08] text-center">
            Explore our most <br />
            loved classes
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-neutral-500 font-normal text-center max-w-lg mx-auto">
            Curated classes chosen by learners to help you grow faster.
          </p>
        </div>

        {/* CARDS STAGE */}
        <div className="relative max-w-6xl mx-auto py-2 overflow-hidden">
          {/* Subtle Top & Bottom Fade Masks */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-15" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/85 to-transparent z-15" />

          {/* Left & Right Horizontal Fade Masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-15" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-15" />

          {/* TWO SEPARATE MARQUEE ROWS - ZERO VERTICAL OVERLAP */}
          <div className="flex flex-col gap-6 sm:gap-8 w-full">
            {/* UNDERGROUND ANIMATION - ROW 1 MOVING LEFT */}
            <div className="relative w-full overflow-hidden z-0 py-1">
              <div className="flex w-max animate-marquee gap-5 sm:gap-6 hover:[animation-play-state:paused] transition-all">
                {row1Items.map((course, idx) => {
                  const isSelected = course.id === selectedCourse.id;
                  return (
                    <button
                      key={`${course.id}-row1-${idx}`}
                      type="button"
                      onClick={() => handleCardClick(course)}
                      className={`w-[295px] sm:w-[325px] h-[340px] sm:h-[360px] shrink-0 text-left rounded-[22px] p-4 sm:p-5 border bg-white flex flex-col justify-between transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? "border-primary-solid shadow-md ring-2 ring-primary-solid/20 scale-[1.01]"
                          : "border-neutral-200/80 hover:border-primary-solid/40 hover:shadow-md"
                      }`}
                    >
                      <div>
                        {/* Graphic Header Area */}
                        <div className="h-36 sm:h-40 w-full rounded-2xl bg-[#f4f5f7] flex items-center justify-center overflow-hidden mb-3">
                          {renderGraphicPattern(course.pattern)}
                        </div>

                        <h3 className="text-base sm:text-[17px] font-bold text-[#111827] leading-snug line-clamp-1">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-1 text-amber-400 text-xs mt-1.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className="h-3.5 w-3.5" />
                          ))}
                          <span className="ml-1 text-neutral-400 font-medium">{course.rating}</span>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-3">
                        <p className="text-xs font-bold text-neutral-800">{course.instructor}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{course.instructorRole}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UNDERGROUND ANIMATION - ROW 2 MOVING OPPOSITE (RIGHT) */}
            <div className="relative w-full overflow-hidden z-0 py-1">
              <div className="flex w-max animate-marquee-reverse gap-5 sm:gap-6 hover:[animation-play-state:paused] transition-all">
                {row2Items.map((course, idx) => {
                  const isSelected = course.id === selectedCourse.id;
                  return (
                    <button
                      key={`${course.id}-row2-${idx}`}
                      type="button"
                      onClick={() => handleCardClick(course)}
                      className={`w-[295px] sm:w-[325px] h-[340px] sm:h-[360px] shrink-0 text-left rounded-[22px] p-4 sm:p-5 border bg-white flex flex-col justify-between transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? "border-primary-solid shadow-md ring-2 ring-primary-solid/20 scale-[1.01]"
                          : "border-neutral-200/80 hover:border-primary-solid/40 hover:shadow-md"
                      }`}
                    >
                      <div>
                        {/* Graphic Header Area */}
                        <div className="h-36 sm:h-40 w-full rounded-2xl bg-[#f4f5f7] flex items-center justify-center overflow-hidden mb-3">
                          {renderGraphicPattern(course.pattern)}
                        </div>

                        <h3 className="text-base sm:text-[17px] font-bold text-[#111827] leading-snug line-clamp-1">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-1 text-amber-400 text-xs mt-1.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className="h-3.5 w-3.5" />
                          ))}
                          <span className="ml-1 text-neutral-400 font-medium">{course.rating}</span>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-3">
                        <p className="text-xs font-bold text-neutral-800">{course.instructor}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{course.instructorRole}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* THE FOCUSED ELEVATED CENTERPIECE CARD - FLOATING & TILTED IN THE CENTER */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto w-full max-w-[325px] sm:max-w-[355px]">
            <div className="w-full rounded-[28px] bg-white p-4 sm:p-5 border border-neutral-200/90 shadow-[0_22px_55px_-12px_rgba(0,0,0,0.22)] transition-all duration-300 transform -rotate-[3.8deg] hover:rotate-0 hover:scale-[1.02]">
              {/* Vibrant Burgundy Gradient Banner with Layered Lotus Flower */}
              <div className="h-40 sm:h-44 w-full rounded-2xl bg-gradient-to-br from-primary-solid via-[#8F1532] to-[#500c1c] flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Subtle Ambient Radial Grid */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Layered Lotus Flower Illustration matching reference design */}
                <svg viewBox="0 0 200 160" className="h-32 sm:h-36 w-auto drop-shadow-md relative z-10" fill="none">
                  {/* Outer bottom petals */}
                  <path
                    d="M 100 135 C 55 135, 20 110, 15 90 C 15 75, 45 75, 75 95 C 88 104, 96 118, 100 135 Z"
                    fill="#FFFFFF"
                    opacity="0.38"
                  />
                  <path
                    d="M 100 135 C 145 135, 180 110, 185 90 C 185 75, 155 75, 125 95 C 112 104, 104 118, 100 135 Z"
                    fill="#FFFFFF"
                    opacity="0.38"
                  />
                  {/* Mid side petals */}
                  <path
                    d="M 100 138 C 45 125, 22 80, 28 62 C 34 46, 62 58, 82 82 C 92 94, 98 116, 100 138 Z"
                    fill="#FFFFFF"
                    opacity="0.58"
                  />
                  <path
                    d="M 100 138 C 155 125, 178 80, 172 62 C 166 46, 138 58, 118 82 C 108 94, 102 116, 100 138 Z"
                    fill="#FFFFFF"
                    opacity="0.58"
                  />
                  {/* Inner petals */}
                  <path
                    d="M 100 140 C 60 118, 45 60, 56 40 C 68 25, 88 48, 94 78 C 98 98, 100 122, 100 140 Z"
                    fill="#FFFFFF"
                    opacity="0.8"
                  />
                  <path
                    d="M 100 140 C 140 118, 155 60, 144 40 C 132 25, 112 48, 106 78 C 102 98, 100 122, 100 140 Z"
                    fill="#FFFFFF"
                    opacity="0.8"
                  />
                  {/* Center tall petal */}
                  <path
                    d="M 100 142 C 84 108, 80 46, 100 22 C 120 46, 116 108, 100 142 Z"
                    fill="#FFFFFF"
                    opacity="0.95"
                  />
                </svg>
              </div>

              {/* Auto-filled Focused Card Details */}
              <div className="mt-3 text-left">
                {/* Badge Pill */}
                <span className="inline-block rounded-full bg-primary-solid/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary-solid mb-1">
                  {selectedCourse.badge}
                </span>

                <h3 className="text-lg sm:text-[19px] font-extrabold text-[#111827] leading-snug line-clamp-1">
                  {selectedCourse.title}
                </h3>

                <div className="flex items-center gap-1 text-amber-400 text-xs mt-1.5 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="h-3.5 w-3.5" />
                  ))}
                  <span className="ml-1 text-neutral-500 font-medium">{selectedCourse.rating}</span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {selectedCourse.description}
                </p>

                <div className="mt-2.5">
                  <p className="text-xs font-bold text-neutral-900">{selectedCourse.instructor}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{selectedCourse.instructorRole}</p>
                </div>

                {/* Join Class Now Pill Button */}
                <div className="mt-3.5 sm:mt-4">
                  <Link
                    href="/register"
                    className="block w-full text-center rounded-full bg-primary-solid hover:bg-primary-hover text-white py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98]"
                  >
                    Join Class Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CATEGORY FILTER PILL TABS AT THE BOTTOM CENTER */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-[calc(100%-1.5rem)] sm:max-w-max flex justify-center px-1">
            <div className="rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-200/90 p-1 sm:p-1.5 flex items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-1 sm:gap-1.5 max-w-full">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary-solid text-white shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
