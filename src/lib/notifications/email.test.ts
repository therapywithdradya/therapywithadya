import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

import {
  formatEmailDateTime,
  buildClientConfirmationHtml,
  buildPractitionerNotificationHtml,
  sendBookingNotificationEmails,
  type BookingEmailDetails,
} from "./email";

describe("Email Notification Service", () => {
  const sampleDetails: BookingEmailDetails = {
    bookingId: "test-booking-uuid-1234",
    customerName: "Priyanshu Singh",
    customerEmail: "priyanshu@example.com",
    customerPhone: "+919876543210",
    customerNote: "Looking forward to working through anxiety.",
    sessionName: "Individual Psychotherapy",
    durationMinutes: 60,
    amountPaise: 150000,
    startsAt: new Date("2026-11-02T07:00:00Z"), // 12:30 PM IST
    endsAt: new Date("2026-11-02T08:00:00Z"),   // 1:30 PM IST
    timezone: "Asia/Kolkata",
    publicToken: "test_token_abc123",
  };

  describe("formatEmailDateTime", () => {
    it("formats dates properly into IST string", () => {
      const formatted = formatEmailDateTime(
        sampleDetails.startsAt,
        sampleDetails.endsAt,
        sampleDetails.timezone,
      );
      expect(formatted).toContain("Monday, 2 November 2026");
      expect(formatted.toLowerCase()).toContain("12:30 pm – 1:30 pm (ist)");
    });
  });

  describe("HTML Templates", () => {
    it("generates client confirmation HTML with details and security links", () => {
      const html = buildClientConfirmationHtml(sampleDetails);
      expect(html).toContain("Therapy with Dr. Adya");
      expect(html).toContain("Priyanshu Singh");
      expect(html).toContain("Individual Psychotherapy (60 min)");
      expect(html).toContain("₹1,500");
      expect(html).toContain("TEST-BOO");
      expect(html).toContain("/book/confirmation/test_token_abc123");
      expect(html).toContain("Vandrevala Foundation");
    });

    it("escapes special HTML characters in client name and notes", () => {
      const html = buildClientConfirmationHtml({
        ...sampleDetails,
        customerName: '<script>alert("hack")</script>',
        customerNote: "Notes & more <things>",
      });
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("generates practitioner notification HTML with client details", () => {
      const html = buildPractitionerNotificationHtml(sampleDetails);
      expect(html).toContain("New Appointment Confirmed");
      expect(html).toContain("Priyanshu Singh");
      expect(html).toContain("priyanshu@example.com");
      expect(html).toContain("+919876543210");
      expect(html).toContain("₹1,500");
      expect(html).toContain("Looking forward to working through anxiety.");
    });
  });

  describe("sendBookingNotificationEmails", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      vi.clearAllMocks();
    });

    it("skips gracefully when RESEND_API_KEY is unset without throwing", async () => {
      delete process.env.RESEND_API_KEY;
      const res = await sendBookingNotificationEmails(sampleDetails);
      expect(res.clientSent).toBe(false);
      expect(res.practitionerSent).toBe(false);
    });
  });
});
