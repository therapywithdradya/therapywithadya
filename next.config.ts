import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // TODO(payments): Add a Content-Security-Policy together with Razorpay Checkout.
  // Do not guess script-src or frame-src before that phase. Checkout needs
  // scripts and frames from Razorpay domains.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
