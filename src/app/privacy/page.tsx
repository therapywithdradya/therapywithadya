import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information. This page is not final legal text yet.",
};

export default function PrivacyPage() {
  return <PlaceholderPage title="Privacy" />;
}
