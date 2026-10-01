import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Reviews. No testimonials are published on this page yet.",
};

export default function ReviewsPage() {
  return <PlaceholderPage title="Reviews" />;
}
