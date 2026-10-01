import { Container } from "@/components/ui/container";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Container className="py-section">
      <h1 className="font-serif text-display text-ink">{title}</h1>
      <p className="mt-4 max-w-2xl text-lead text-muted">
        This page is coming in the next step.
      </p>
    </Container>
  );
}
