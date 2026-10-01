import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

export const fontSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
  adjustFontFallback: true,
});
