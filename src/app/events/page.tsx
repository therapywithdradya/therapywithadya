import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Events",
  description: "Events and workshops. The page content is not published yet.",
};

export default function EventsPage() {
  return <PlaceholderPage title="Events" />;
}
