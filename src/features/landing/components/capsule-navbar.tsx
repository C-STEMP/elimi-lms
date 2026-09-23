"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenu, HiX, HiOutlineSearch } from "react-icons/hi";
import {
  FiBookOpen,
  FiAward,
  FiShield,
  FiHelpCircle,
  FiArrowRight,
} from "react-icons/fi";
import { ASSETS_URL } from "@/assets";

const TRADE_LINKS = [
  { name: "Electrical Installation & Solar PV", href: "#courses", icon: "⚡" },
  { name: "Plumbing & Pipefitting Technology", href: "#courses", icon: "🔧" },
  { name: "Carpentry & Architectural Joinery", href: "#courses", icon: "🪚" },
  { name: "Masonry & Blocklaying Craft", href: "#courses", icon: "🧱" },
  { name: "Welding & Metal Fabrication", href: "#courses", icon: "🔥" },
  { name: "Wall & Floor Tiling Technology", href: "#courses", icon: "📐" },
];

export const CapsuleNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Lock body scroll when full menu is open on mobile
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const filteredTrades = TRADE_LINKS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Floating White Capsule Pill Navbar - Compact & Centered */}
      <div className="w-full relative z-30 pt-4 sm:pt-6 px-4">
        <div className="mx-auto max-w-md sm:max-w-lg lg:max-w-xl rounded-full bg-white shadow-xl border border-white/80 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* Left: Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-primary-solid transition-colors py-1 px-1 rounded-lg focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <HiMenu className="h-5 w-5 text-neutral-800" />
            <span className="font-semibold text-xs sm:text-sm">Menu</span>
          </button>

          {/* Center: Elimi Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={ASSETS_URL.logoIcon2}
              alt="Elimi Logo"
              width={86}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Login & Join with us */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-primary-solid transition-colors px-1 sm:px-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              Join with us
            </Link>
          </div>
        </div>
      </div>

      {/* Functioning Interactive Full Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Logo and Close Button */}
            <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Image
                  src={ASSETS_URL.logoIcon2}
                  alt="Elimi Logo"
                  width={110}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <span className="rounded-full bg-primary-solid/10 px-2.5 py-0.5 text-[10px] font-bold text-primary-solid uppercase tracking-wider">
                  Menu
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                aria-label="Close menu"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="mt-5 relative">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trade courses, modules, or skills..."
                className="w-full rounded-xl bg-neutral-100/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-solid/30 border border-transparent"
              />
            </div>

            {/* Navigation Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Trade Curriculums */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Trade Curriculums
                </p>
                <div className="flex flex-col gap-1.5">
                  {filteredTrades.map((trade) => (
                    <Link
                      key={trade.name}
                      href={trade.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-solid transition-colors"
                    >
                      <span className="text-base">{trade.icon}</span>
                      <span className="font-medium">{trade.name}</span>
                    </Link>
                  ))}
                  {filteredTrades.length === 0 && (
                    <p className="text-xs text-neutral-400 py-2">
                      No matching trades found.
                    </p>
                  )}
                </div>
              </div>

              {/* Ecosystem & Platform Links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Elimi Ecosystem
                </p>
                <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  <Link
                    href="#pathway"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 hover:text-primary-solid transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FiShield className="h-4 w-4 text-primary-solid" />
                      <span>Competency Assessment (Elimi CAP)</span>
                    </div>
                    <FiArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 hover:text-primary-solid transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FiBookOpen className="h-4 w-4 text-emerald-600" />
                      <span>Learner Dashboard</span>
                    </div>
                    <FiArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                  </Link>

                  <Link
                    href="/certificates"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 hover:text-primary-solid transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FiAward className="h-4 w-4 text-amber-600" />
                      <span>Certificates &amp; Credentials</span>
                    </div>
                    <FiArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                  </Link>

                  <Link
                    href="#faqs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 hover:text-primary-solid transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FiHelpCircle className="h-4 w-4 text-purple-600" />
                      <span>FAQs &amp; Guidance</span>
                    </div>
                    <FiArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                  </Link>
                </div>

                {/* Direct Action Box */}
                <div className="mt-5 rounded-2xl bg-primary-solid/5 border border-primary-solid/20 p-4">
                  <p className="text-xs font-bold text-primary-solid">
                    Ready to start learning?
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-1">
                    Free account creation for candidates and apprentice
                    artisans.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full bg-primary-solid text-white px-4 py-1.5 text-xs font-bold hover:bg-primary-hover transition-colors"
                    >
                      Join Free
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-semibold text-neutral-700 hover:text-primary-solid px-3 py-1.5"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
