import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Book a session",
  description: "Session booking. The booking flow is not available on this page yet.",
};

export default function BookPage() {
  return <PlaceholderPage title="Book a session" />;
}
