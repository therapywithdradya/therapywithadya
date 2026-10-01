import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact details. A message form is not available yet.",
};

export default function ContactPage() {
  return <PlaceholderPage title="Contact" />;
}
