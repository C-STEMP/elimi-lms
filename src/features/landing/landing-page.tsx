import React from "react";
import { TopMarquee } from "./components/top-marquee";
import { HeroSection } from "./components/hero-section";
import { PartnerStrip } from "./components/partner-strip";
import { CoursesSection } from "./components/courses-section";
import { MarqueeTicker } from "./components/marquee-ticker";
import { FloatingStickersSection } from "./components/floating-stickers-section";
import { ScenicTestimonial } from "./components/scenic-testimonial";
import { FaqSection } from "./components/faq-section";
import { Footer } from "./components/footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white select-text">
      <TopMarquee />
      <main className="flex-1">
        <HeroSection />
        <PartnerStrip />
        <CoursesSection />
        <MarqueeTicker />
        <FloatingStickersSection />
        <ScenicTestimonial />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};
