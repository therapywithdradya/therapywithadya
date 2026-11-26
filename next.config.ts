import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://api.razorpay.com https://*.supabase.co https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com;
  frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/tempPages/design1", destination: "/tempPages/design-1", permanent: false },
      { source: "/tempPages/design2", destination: "/tempPages/design-2", permanent: false },
      { source: "/tempPages/design3", destination: "/tempPages/design-3", permanent: false },
      { source: "/tempPages/design4", destination: "/tempPages/design-4", permanent: false },
      { source: "/tempPages/design5", destination: "/tempPages/design-5", permanent: false },
      { source: "/tempPages/demo-1", destination: "/tempPages/design-1", permanent: false },
      { source: "/tempPages/demo-2", destination: "/tempPages/design-2", permanent: false },
      { source: "/tempPages/demo-3", destination: "/tempPages/design-3", permanent: false },
      { source: "/tempPages/demo-4", destination: "/tempPages/design-4", permanent: false },
      { source: "/tempPages/demo-5", destination: "/tempPages/design-5", permanent: false },
      { source: "/tempPages/demo1", destination: "/tempPages/design-1", permanent: false },
      { source: "/tempPages/demo2", destination: "/tempPages/design-2", permanent: false },
      { source: "/tempPages/demo3", destination: "/tempPages/design-3", permanent: false },
      { source: "/tempPages/demo4", destination: "/tempPages/design-4", permanent: false },
      { source: "/tempPages/demo5", destination: "/tempPages/design-5", permanent: false },
    ];
  },
};


export default nextConfig;
