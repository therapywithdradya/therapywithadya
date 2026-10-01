import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Gallery. The page content is not published yet.",
};

export default function GalleryPage() {
  return <PlaceholderPage title="Gallery" />;
}
