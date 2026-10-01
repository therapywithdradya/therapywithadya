import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Services",
  description: "Services offered by this practice. The page content is not published yet.",
};

export default function ServicesPage() {
  return <PlaceholderPage title="Services" />;
}
