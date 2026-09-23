"use client";

import React from "react";
import Link from "next/link";
import { FiInstagram, FiLinkedin, FiFacebook, FiTwitter } from "react-icons/fi";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white relative overflow-hidden">
      {/* Top Pre-Footer Call to Action */}
      <div className="w-full py-16 sm:py-20 text-center px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#241014] tracking-tight">
          Start learning in a way <br className="hidden sm:inline" />
          that feels right for you.
        </h2>
        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
          >
            Get started for free
          </Link>
        </div>
      </div>

      {/* Concave Curved Arch Transition into Vibrant Primary-Solid Burgundy Footer */}
      <div className="relative w-full">
        {/* SVG Arch Curve */}
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 md:h-28 block text-primary-solid"
        >
          <path
            d="M0,140 Q720,0 1440,140 L1440,140 L0,140 Z"
            fill="currentColor"
          />
        </svg>

        {/* Central Circular Brand Emblem Icon */}
        <div className="absolute left-1/2 -top-6 sm:-top-8 -translate-x-1/2 flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-white shadow-xl border-4 border-primary-solid">
          <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-primary-solid flex items-center justify-center text-white font-black text-sm sm:text-base font-mono">
            E
          </div>
        </div>
      </div>

      {/* Main Curved Footer Body */}
      <div className="relative bg-primary-solid text-white pt-10 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* 3 Columns Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left text-xs sm:text-sm">
            {/* Column 1: Explore */}
            <div>
              <h4 className="font-bold text-white/95 uppercase tracking-widest text-xs mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-white/75 font-medium">
                <li>
                  <Link href="#courses" className="hover:text-white transition-colors">
                    Trade Courses
                  </Link>
                </li>
                <li>
                  <Link href="#courses" className="hover:text-white transition-colors">
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link href="#courses" className="hover:text-white transition-colors">
                    Popular Classes
                  </Link>
                </li>
                <li>
                  <Link href="#courses" className="hover:text-white transition-colors">
                    Trade Categories
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-white transition-colors">
                    Certificates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="font-bold text-white/95 uppercase tracking-widest text-xs mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5 text-white/75 font-medium">
                <li>
                  <Link href="#faqs" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#faqs" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Learning Guides
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    CAP Portal (Assessment)
                  </Link>
                </li>
                <li>
                  <Link href="#courses" className="hover:text-white transition-colors">
                    Assessment Labs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white/95 uppercase tracking-widest text-xs mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-white/75 font-medium">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Elimi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    TVET Framework
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons Strip */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
            <div className="flex items-center gap-5 text-white/80">
              <Link href="#" className="hover:text-white transition-colors">
                <FiInstagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FiLinkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FiFacebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FiTwitter className="h-4 w-4" />
              </Link>
            </div>

            <p>© {new Date().getFullYear()} Elimi LMS. All rights reserved.</p>
          </div>
        </div>

        {/* Giant Translucent Watermark Text At The Very Bottom */}
        <div className="pointer-events-none select-none text-center mt-6 -mb-10 sm:-mb-14 overflow-hidden">
          <span className="text-[90px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-black tracking-tighter text-white/10 block uppercase font-mono leading-none">
            ELIMI
          </span>
        </div>
      </div>
    </footer>
  );
};
