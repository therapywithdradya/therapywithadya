import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ConfirmationView } from "./confirmation-view";

export const metadata: Metadata = {
  title: "Booking Confirmation | Dr. Adya Vats Practice",
  description: "View your verified session booking confirmation and appointment details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen py-16 md:py-24">
      <Container>
        <ConfirmationView token={token} />
      </Container>
    </main>
  );
}
