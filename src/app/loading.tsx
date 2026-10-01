import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-section">
      <p role="status" className="text-lead text-muted">
        Loading
      </p>
    </Container>
  );
}
