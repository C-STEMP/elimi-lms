"use client";

import React from "react";

const PARTNER_LOGOS = [
  {
    name: "GOODCOMPANY",
    element: (
      <span className="font-extrabold tracking-tight text-base sm:text-lg text-neutral-800 uppercase font-sans">
        GOODCOMPANY
      </span>
    ),
  },
  {
    name: "Spotify",
    element: (
      <div className="flex items-center gap-2 text-neutral-800">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.308c-.22.361-.69.475-1.05.255-2.884-1.762-6.513-2.16-10.788-1.183-.414.095-.826-.162-.921-.576-.095-.415.162-.826.576-.921 4.678-1.07 8.685-.619 11.928 1.365.361.22.475.69.255 1.06zm1.472-3.275c-.277.449-.868.594-1.317.317-3.298-2.028-8.326-2.614-12.227-1.428-.507.155-1.042-.132-1.197-.639-.155-.507.132-1.042.639-1.197 4.459-1.355 9.992-.705 13.785 1.63.449.277.594.868.317 1.317zm.126-3.41c-3.953-2.348-10.473-2.565-14.25-1.418-.605.184-1.246-.162-1.43-.767-.184-.606.162-1.246.767-1.43 4.339-1.317 11.536-1.066 16.074 1.628.545.324.726 1.033.402 1.578-.324.546-1.033.727-1.563.409z" />
        </svg>
        <span className="font-bold text-base sm:text-lg tracking-tight">Spotify</span>
      </div>
    ),
  },
  {
    name: "Google",
    element: (
      <span className="font-bold text-lg sm:text-xl tracking-tight text-neutral-800 font-sans">
        Google
      </span>
    ),
  },
  {
    name: "Meta",
    element: (
      <div className="flex items-center gap-1.5 text-neutral-800">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 5.5c-3.8 0-6.8 2.6-8.2 6.5 1.4 3.9 4.4 6.5 8.2 6.5s6.8-2.6 8.2-6.5C18.8 8.1 15.8 5.5 12 5.5zm0 10.8c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3 4.3 1.9 4.3 4.3-1.9 4.3-4.3 4.3z" />
        </svg>
        <span className="font-bold text-base sm:text-lg tracking-tight">Meta</span>
      </div>
    ),
  },
  {
    name: "SQUARE ENIX",
    element: (
      <span className="font-bold text-sm sm:text-base tracking-widest text-neutral-800 uppercase font-mono">
        SQUARE ENIX
      </span>
    ),
  },
  {
    name: "C-STEMP",
    element: (
      <span className="font-black text-base sm:text-lg tracking-wider text-neutral-800 uppercase font-sans">
        C-STEMP
      </span>
    ),
  },
  {
    name: "NBTE",
    element: (
      <span className="font-black text-base sm:text-lg tracking-wider text-neutral-800 uppercase font-sans">
        NBTE
      </span>
    ),
  },
  {
    name: "GIZ",
    element: (
      <span className="font-black text-base sm:text-lg tracking-wider text-neutral-800 uppercase font-sans">
        GIZ
      </span>
    ),
  },
];

export const PartnerStrip: React.FC = () => {
  return (
    <section className="w-full py-10 sm:py-14 border-b border-neutral-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Title above */}
        <p className="text-xs sm:text-sm font-medium text-neutral-500 tracking-normal mb-8 select-none">
          Our learners work at leading companies
        </p>

        {/* Marquee constrained strictly within this width */}
        <div className="relative w-full overflow-hidden">
          {/* Left & Right gradient edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Single-Line Continuous Scrolling Track */}
          <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16 md:gap-20 py-1 opacity-80 hover:opacity-100 transition-opacity">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, idx) => (
              <div key={idx} className="shrink-0 flex items-center select-none">
                {logo.element}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
