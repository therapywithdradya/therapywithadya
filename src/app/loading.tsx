import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-section">
      <div role="status" aria-live="polite" className="space-y-8 animate-pulse">
        <span className="sr-only">Loading page content</span>
        <div className="space-y-4">
          <div className="h-3 w-28 rounded-full bg-primary/30" />
          <div className="h-10 w-2/3 max-w-md rounded-lg bg-surface" />
          <div className="h-5 w-full max-w-xl rounded-lg bg-surface" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-52 rounded-card border border-border bg-surface" />
          <div className="h-52 rounded-card border border-border bg-surface" />
          <div className="hidden h-52 rounded-card border border-border bg-surface lg:block" />
        </div>
      </div>
    </Container>
  );
}
