"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineSparkles, HiChevronDown, HiMenu, HiX } from "react-icons/hi";
import { FiGrid } from "react-icons/fi";
import { ASSETS_URL } from "@/assets";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <div className="w-full relative z-40">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#520d1e] text-white/90 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#FBCB7C] animate-pulse" />
        <span>
          Nigeria&apos;s TVET &amp; Trade Skills E-Learning &mdash; Study
          theory, pass quizzes, and prepare for{" "}
          <strong className="text-[#FBCB7C] font-semibold">Elimi CAP</strong>{" "}
          assessment
        </span>
        <HiOutlineSparkles className="h-3.5 w-3.5 text-[#FBCB7C] hidden sm:inline" />
      </div>

      {/* Floating Pill Navbar Wrapper */}
      <div className="w-full px-4 sm:px-6 lg:px-8 -mb-7 pt-4 relative z-30">
        <div className="mx-auto max-w-5xl rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-neutral-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* Left: Browse Trades / Catalog Pill Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100/90 hover:bg-neutral-200/80 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 transition-colors"
            >
              <FiGrid className="h-3.5 w-3.5 text-neutral-600" />
              <span>Catalog</span>
              <HiChevronDown
                className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${catalogOpen ? "rotate-180" : ""}`}
              />
            </button>

            {catalogOpen && (
              <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-white p-3 shadow-xl border border-neutral-100 z-50 animate-slide-in">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                  Skilled Trades
                </p>
                <div className="flex flex-col gap-1 text-xs">
                  <Link
                    href="#courses"
                    onClick={() => setCatalogOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-50 hover:text-primary font-medium"
                  >
                    ⚡ Electrical Installation &amp; Solar PV
                  </Link>
                  <Link
                    href="#courses"
                    onClick={() => setCatalogOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-50 hover:text-primary font-medium"
                  >
                    🔧 Plumbing &amp; Pipefitting
                  </Link>
                  <Link
                    href="#courses"
                    onClick={() => setCatalogOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-50 hover:text-primary font-medium"
                  >
                    🪚 Carpentry &amp; Architectural Joinery
                  </Link>
                  <Link
                    href="#courses"
                    onClick={() => setCatalogOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-50 hover:text-primary font-medium"
                  >
                    🧱 Masonry &amp; Blocklaying
                  </Link>
                  <Link
                    href="#courses"
                    onClick={() => setCatalogOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-50 hover:text-primary font-medium"
                  >
                    🔥 Welding &amp; Fabrication
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={ASSETS_URL.logoIcon2}
              alt="Elimi Logo"
              width={100}
              height={36}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Auth Links & Rounded Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-700 hover:text-primary transition-colors hidden sm:inline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#1B6CA8] hover:bg-[#145688] text-white px-4 sm:px-5 py-2 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              Join for free
            </Link>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex h-8 w-8 items-center justify-center text-neutral-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiX className="h-5 w-5" />
              ) : (
                <HiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-5xl rounded-2xl bg-white p-4 shadow-xl border border-neutral-100 sm:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <Link
                href="#courses"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-neutral-800"
              >
                Trade Courses
              </Link>
              <Link
                href="#pathway"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-neutral-800"
              >
                The Pathway (CAP)
              </Link>
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-neutral-800"
              >
                Features
              </Link>
              <Link
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-neutral-800"
              >
                FAQs
              </Link>
              <div className="border-t border-neutral-100 pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-full bg-[#1B6CA8] text-xs font-bold text-white"
                >
                  Join for free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
