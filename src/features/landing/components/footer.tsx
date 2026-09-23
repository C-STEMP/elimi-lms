"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiInstagram } from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaXTwitter } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-primary-solid relative overflow-hidden select-none">
      <div className="relative w-full overflow-hidden border-t border-neutral-200/90">
        <div className="absolute inset-0 bg-primary-solid pointer-events-none">
          <svg className="w-full h-full" fill="none">
            <defs>
              <pattern
                id="ctaBgRects"
                x="0"
                y="0"
                width="26"
                height="26"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="13"
                  cy="13"
                  r="5"
                  stroke="rgba(255, 255, 255, 0.18)"
                  strokeWidth="1.3"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaBgRects)" />
          </svg>
        </div>
        {/* White Curved Background Canvas SVG Enclosing The Content */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 520"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block text-white"
          >
            <path
              d="M 0,0
                 L 1440,0
                 L 1440,190
                 C 1410,205 1365,210 1340,220
                 C 1355,245 1375,270 1378,295
                 C 1382,360 1280,440 1090,485
                 C 940,515 820,520 720,520
                 C 620,520 500,515 350,485
                 C 160,440 58,360 62,295
                 C 65,270 85,245 100,220
                 C 75,210 30,205 0,190
                 Z"
              fill="white"
            />
          </svg>
        </div>
        {/* Foreground Content: Headline & Button (Directly inside the white curved area) */}
        <div className="relative z-10 w-full pt-16 sm:pt-24 md:pt-28 pb-20 sm:pb-28 md:pb-32 text-center px-4">
          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-[#111827] tracking-tight leading-[1.08] max-w-2xl mx-auto">
            Start learning in a way <br />
            that feels right for you.
          </h2>
          <div className="mt-7 sm:mt-9 flex justify-center">
            <Link
              href="/register"
              className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-8 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 pointer-events-auto"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </div>

      <div className="relative bg-primary-solid text-white pt-20 sm:pt-24 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
          <Image
            src="/elimi-seal-medallion.svg"
            alt="Elimi Wax Seal Medallion"
            width={116}
            height={116}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 drop-shadow-2xl select-none"
            priority
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-75"
          style={{
            maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 20%, transparent 95%)",
          }}
        >
          <svg className="w-full h-full" fill="none">
            <defs>
              <pattern
                id="footerBodyRects"
                x="0"
                y="0"
                width="26"
                height="26"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="13"
                  cy="13"
                  r="5"
                  stroke="rgba(255, 255, 255, 0.18)"
                  strokeWidth="1.3"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerBodyRects)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mx-auto w-full max-w-195 px-4 grid grid-cols-3 gap-6 sm:gap-10 md:gap-14 text-center">
            <div className="flex flex-col items-center text-center">
              <h4 className="text-white/60 font-normal text-xs sm:text-sm mb-5 sm:mb-6">
                Explore
              </h4>
              <ul className="space-y-3 sm:space-y-3.5 text-white font-medium text-sm sm:text-lg">
                <li>
                  <Link
                    href="#courses"
                    className="hover:text-white/80 transition-colors"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="#courses"
                    className="hover:text-white/80 transition-colors"
                  >
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link
                    href="#courses"
                    className="hover:text-white/80 transition-colors"
                  >
                    Popular Classes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#courses"
                    className="hover:text-white/80 transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificates"
                    className="hover:text-white/80 transition-colors"
                  >
                    Certificates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-white/60 font-normal text-xs sm:text-sm mb-5 sm:mb-6">
                Resources
              </h4>
              <ul className="space-y-3 sm:space-y-3.5 text-white font-medium text-sm sm:text-lg">
                <li>
                  <Link
                    href="#faqs"
                    className="hover:text-white/80 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faqs"
                    className="hover:text-white/80 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white/80 transition-colors"
                  >
                    Learning Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white/80 transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-white/60 font-normal text-xs sm:text-sm mb-5 sm:mb-6">
                Company
              </h4>
              <ul className="space-y-3 sm:space-y-3.5 text-white font-medium text-sm sm:text-lg">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    About Elimi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Subtitle & Social Icons Strip matching reference */}
          <div className="mt-12 sm:mt-14 text-center">
            <p className="text-xs sm:text-sm text-white/70 font-normal mb-5 sm:mb-6">
              Follow us on social media for updates, learning tips, and new
              courses.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-7 text-xs sm:text-sm text-white font-medium mb-8 sm:mb-10">
              <Link
                href="#"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FiInstagram className="h-4 w-4" />
                <span>Instagram</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FaLinkedin className="h-4 w-4" />
                <span>Linkedin</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FaFacebook className="h-4 w-4" />
                <span>Facebook</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
                <span>Twitter</span>
              </Link>
            </div>

            <p className="text-xs text-white/60 font-normal">
              © {new Date().getFullYear()} Elimi. All Rights Reserved
            </p>
          </div>
        </div>

        {/* FULL ELIMI LOGO WATERMARK - TIGHT UNDER COPYRIGHT AND CUT OFF AT BOTTOM */}
        <div className="pointer-events-none select-none text-center mt-3 sm:mt-4 overflow-hidden flex justify-center -mb-8 sm:-mb-14 md:-mb-20">
          <Image
            src="/elimi-logo-tight.svg"
            alt="Elimi Logo Watermark"
            width={1100}
            height={363}
            className="w-[88%] sm:w-[84%] md:w-[78%] max-w-262.5 h-auto object-contain opacity-10 select-none pointer-events-none mx-auto block shrink-0"
          />
        </div>
      </div>
    </footer>
  );
};
