import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const lmsBase =
      process.env.NEXT_PUBLIC_LMS_API_BASE_URL ||
      "https://www.staging-api.elimi-ecosystem.e-limi.africa/v1/lms";
    const origin = new URL(lmsBase).origin;

    return [
      {
        source: "/scorm-proxy/:path*",
        destination: `${origin}/:path*`,
      },
    ];
  },
  devIndicators: false,
};

export default nextConfig;

