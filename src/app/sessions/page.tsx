import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Sessions",
  description: "Bookable sessions. Durations and fees are not published on this page yet.",
};

export default function SessionsPage() {
  return <PlaceholderPage title="Sessions" />;
}
