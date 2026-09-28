import type { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import { AppProviders } from "@/shared/providers/app-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "ELIMI Learn :: Vocational Training & TVET Learning Platform",
    template: "%s | ELIMI Learn",
  },
  description:
    "ELIMI is Africa's platform for getting trained, certified, and hired in the skilled trades, all in one place. Explore NOS-aligned vocational training and trade courses.",
  keywords: [
    "ELIMI",
    "ELIMI Learn",
    "TVET Nigeria",
    "TVET Africa",
    "Vocational Training",
    "National Occupational Standards",
    "NOS Training",
    "Skilled Trades",
    "E-Learning",
    "Trade Skills",
  ],
  authors: [{ name: "ELIMI Africa", url: "https://training.elimi.africa" }],
  creator: "ELIMI Africa",
  publisher: "ELIMI Africa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/elimi-favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "https://training.elimi.africa",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ELIMI Learn — Vocational Training & TVET Learning Platform",
    description:
      "Africa's platform for getting trained, certified, and hired in the skilled trades, all in one place.",
    url:
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "https://training.elimi.africa",
    siteName: "ELIMI Learn :: Vocational Training LMS",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "ELIMI Logo",
      },
      {
        url: "/landing-img-1.jpg",
        width: 1200,
        height: 630,
        alt: "ELIMI Learn - Skilled-Trades TVET Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELIMI Learn — Vocational Training & TVET Learning Platform",
    description:
      "Africa's platform for getting trained, certified, and hired in the skilled trades, all in one place.",
    images: ["/icon.png", "/landing-img-1.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://training.elimi.africa/#organization",
      name: "ELIMI",
      url: "https://training.elimi.africa",
      logo: "https://training.elimi.africa/icon.png",
      description:
        "Africa's Unified Skilled-Trades Ecosystem for training, certification, and employment.",
    },
    {
      "@type": "WebSite",
      "@id": "https://training.elimi.africa/#website",
      url: "https://training.elimi.africa",
      name: "ELIMI Learn TVET Platform",
      publisher: {
        "@id": "https://training.elimi.africa/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${workSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans text-dark">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
