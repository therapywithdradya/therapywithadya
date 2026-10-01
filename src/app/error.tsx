"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-section">
      <h1 className="font-serif text-display text-ink">Something went wrong</h1>
      <p className="mt-4 max-w-2xl text-lead text-muted">
        This page could not be loaded. Please try again.
      </p>
      <div className="mt-6">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
