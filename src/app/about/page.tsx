import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "About",
  description: "About this practice. The page content is not published yet.",
};

export default function AboutPage() {
  return <PlaceholderPage title="About" />;
}
