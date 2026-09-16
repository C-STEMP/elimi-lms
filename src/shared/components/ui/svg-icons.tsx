import React from "react";

export const PartyPopperIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M54 14L60 20M60 14L54 20" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
    <circle cx="34" cy="18" r="3.5" fill="#3B82F6" />
    <circle cx="68" cy="30" r="4" fill="#8B5CF6" />
    <rect x="44" y="24" width="7" height="7" rx="2" fill="#10B981" transform="rotate(25 44 24)" />
    <path d="M24 30C24 30 29 25 34 29" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    <path d="M62 14C62 14 67 19 70 14" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M28 66L48 46L56 54L36 74C33.2 76.8 28.8 76.8 26 74C23.2 71.2 23.2 66.8 26 64L28 66Z"
      fill="#FF7A59"
    />
    <path d="M48 46L28 66L21 59C18.2 56.2 18.2 51.8 21 49L41 29L48 46Z" fill="#FFC107" />
    <path d="M48 46L56 54L66 36L48 46Z" fill="#38BDF8" />
    <path d="M48 46L66 36L41 29L48 46Z" fill="#A855F7" />
  </svg>
);

export const ToastSuccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 mt-0.5"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#1E7F4C" />
    <path
      d="M6 10L9 13L14 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ToastErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 mt-0.5"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#B3261E" />
    <path
      d="M7 7L13 13M13 7L7 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ToastInfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 mt-0.5"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#F9A825" />
    <path d="M10 9V14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="6.5" r="1.25" fill="white" />
  </svg>
);

export const ErrorCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="20" cy="20" r="20" fill="#FEE2E2" />
    <path
      d="M14 14L26 26M26 14L14 26"
      stroke="#B3261E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
