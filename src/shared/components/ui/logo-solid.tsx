import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS_URL } from "@/assets";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: "light" | "dark";
  width?: number;
  height?: number;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to keep it out of `...props` (the div doesn't accept a `theme` attribute)
  theme,
  width = 141,
  height,
  href = "/",
  ...props
}) => {
  const computedHeight = height ?? Math.round(width / (141 / 80));

  const content = (
    <div
      suppressHydrationWarning
      className={`flex items-center select-none ${className}`}
      {...props}
    >
      <Image
        src={ASSETS_URL.logoIcon2}
        alt="Elimi Logo"
        width={width}
        height={computedHeight}
        priority
        loading="eager"
        className="object-contain w-auto h-auto"
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
};
