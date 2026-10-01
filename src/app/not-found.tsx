import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-section">
      <h1 className="font-heading text-display text-ink">Page not found</h1>
      <p className="mt-4 max-w-2xl text-lead text-muted">
        This page does not exist.
      </p>
      <div className="mt-6">
        <Button href="/">Back to home</Button>
      </div>
    </Container>
  );
}
