import "server-only";

import { Resend } from "resend";
import { DateTime } from "luxon";
import { getEmailEnv } from "@/lib/env.server";

export type BookingEmailDetails = {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string | null;
  sessionName: string;
  durationMinutes: number;
  amountPaise: number;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  publicToken?: string;
};

/**
 * Formats a Date range into friendly IST string for emails.
 * e.g. "Monday, 2 November 2026, 12:30 pm – 1:30 pm IST"
 */
export function formatEmailDateTime(
  start: Date,
  end: Date,
  zone: string = "Asia/Kolkata",
): string {
  const dtStart = DateTime.fromJSDate(start, { zone });
  const dtEnd = DateTime.fromJSDate(end, { zone });

  const dateStr = dtStart.toFormat("EEEE, d MMMM yyyy");
  const startTimeStr = dtStart.toFormat("h:mm a");
  const endTimeStr = dtEnd.toFormat("h:mm a");

  return `${dateStr}, ${startTimeStr} – ${endTimeStr} (${zone === "Asia/Kolkata" ? "IST" : zone})`;
}

/**
 * Builds HTML template for client confirmation email.
 */
export function buildClientConfirmationHtml(details: BookingEmailDetails): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.therapywithdradya.com";
  const confirmationUrl = details.publicToken
    ? `${siteUrl}/book/confirmation/${details.publicToken}`
    : `${siteUrl}/book`;

  const dateTimeFormatted = formatEmailDateTime(
    details.startsAt,
    details.endsAt,
    details.timezone,
  );

  const formattedFee = `₹${(details.amountPaise / 100).toLocaleString("en-IN")}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your Appointment with Dr. Adya Vats</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0F1410; color: #F7F4EE; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #16251C; border: 1px solid #283C2F; border-radius: 12px; overflow: hidden; }
    .header { background: #121E16; padding: 32px 24px; text-align: center; border-bottom: 1px solid #283C2F; }
    .header h1 { margin: 0; font-size: 22px; color: #F7F4EE; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0 0; color: #6C917B; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; line-height: 1.6; color: #E4E0D7; margin-bottom: 24px; }
    .card { background: #1B2E23; border: 1px solid #2C4736; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #8BA896; }
    .val { color: #F7F4EE; font-weight: 500; text-align: right; }
    .highlight { color: #C9A86C; font-weight: 600; }
    .btn { display: inline-block; background: #C9A86C; color: #16251C !important; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 12px 0 24px 0; }
    .policy { font-size: 12px; line-height: 1.6; color: #8BA896; border-top: 1px solid #283C2F; padding-top: 20px; }
    .footer { background: #121E16; padding: 20px 24px; text-align: center; font-size: 12px; color: #6C917B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Therapy with Dr. Adya</h1>
      <p>Booking Confirmed</p>
    </div>
    <div class="content">
      <p class="greeting">
        Dear ${escapeHtml(details.customerName)},<br><br>
        Your appointment has been successfully scheduled and confirmed. A Google Calendar invitation has also been sent to your email address.
      </p>

      <div class="card">
        <div class="row">
          <span class="label">Session</span>
          <span class="val">${escapeHtml(details.sessionName)} (${details.durationMinutes} min)</span>
        </div>
        <div class="row">
          <span class="label">Date & Time</span>
          <span class="val highlight">${dateTimeFormatted}</span>
        </div>
        <div class="row">
          <span class="label">Consultation Fee</span>
          <span class="val">${formattedFee} (Paid)</span>
        </div>
        <div class="row">
          <span class="label">Booking Ref</span>
          <span class="val" style="font-family: monospace; font-size: 12px;">${details.bookingId.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="btn">View Appointment Details & Policy</a>
      </div>

      <div class="policy">
        <strong>Session Format & Meeting Link:</strong><br>
        Sessions take place online. Dr. Adya will share the private meeting link prior to your scheduled consultation.<br><br>
        <strong>Cancellation & Rescheduling:</strong><br>
        Free rescheduling or cancellation is available with at least 24 hours prior notice. Sessions cancelled within 24 hours of the start time are non-refundable.<br><br>
        <strong>Crisis Support:</strong><br>
        This private practice does not provide 24/7 emergency psychiatric care. If you are experiencing an acute emotional crisis or medical emergency, please call <strong>Vandrevala Foundation (9999 666 555)</strong>, <strong>KIRAN (1800-599-0019)</strong>, or contact emergency services (112).
      </div>
    </div>
    <div class="footer">
      Dr. Adya Vats Practice &bull; <a href="mailto:adyavats13@gmail.com" style="color: #C9A86C; text-decoration: none;">adyavats13@gmail.com</a> &bull; <a href="${siteUrl}" style="color: #6C917B; text-decoration: none;">therapywithdradya.com</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Builds HTML notification for Dr. Adya alerting of a new booking.
 */
export function buildPractitionerNotificationHtml(details: BookingEmailDetails): string {
  const dateTimeFormatted = formatEmailDateTime(
    details.startsAt,
    details.endsAt,
    details.timezone,
  );
  const formattedFee = `₹${(details.amountPaise / 100).toLocaleString("en-IN")}`;

  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f9f9f9; padding: 20px; color: #222;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
    <h2 style="color: #16251C; margin-top: 0;">New Appointment Confirmed</h2>
    <p>A new client has completed booking and payment on your website:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #666;">Client Name:</td><td style="font-weight: bold;">${escapeHtml(details.customerName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Email:</td><td><a href="mailto:${escapeHtml(details.customerEmail)}">${escapeHtml(details.customerEmail)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Phone:</td><td>${escapeHtml(details.customerPhone)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Session:</td><td style="font-weight: bold;">${escapeHtml(details.sessionName)} (${details.durationMinutes} min)</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Date & Time:</td><td style="font-weight: bold; color: #16251C;">${dateTimeFormatted}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Amount Paid:</td><td>${formattedFee}</td></tr>
      ${details.customerNote ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Client Note:</td><td style="background: #f4f7f5; padding: 8px; border-radius: 4px;">${escapeHtml(details.customerNote)}</td></tr>` : ""}
    </table>
    <p style="font-size: 13px; color: #777;">This event has also been added to your Google Calendar.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends booking confirmation emails to client and notification to practitioner.
 * Fail-safe: if Resend is not configured or throws, logs error without bubbling up.
 */
export async function sendBookingNotificationEmails(
  details: BookingEmailDetails,
): Promise<{ clientSent: boolean; practitionerSent: boolean }> {
  const env = getEmailEnv();

  if (!env) {
    console.info(
      "[Notifications] RESEND_API_KEY is not configured. Skipping transactional email.",
    );
    return { clientSent: false, practitionerSent: false };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  let clientSent = false;
  let practitionerSent = false;

  // 1. Send confirmation to client
  try {
    const clientHtml = buildClientConfirmationHtml(details);
    const { error: clientError } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [details.customerEmail],
      subject: `Confirmed: Your Session with Dr. Adya Vats — ${details.sessionName}`,
      html: clientHtml,
    });

    if (clientError) {
      console.error("[Notifications] Failed to send client confirmation email:", clientError);
    } else {
      clientSent = true;
    }
  } catch (err) {
    console.error("[Notifications] Exception sending client confirmation email:", err);
  }

  // 2. Send notification to practitioner
  try {
    const practitionerEmail = process.env.PRACTITIONER_NOTIFICATION_EMAIL || "therapywithdradya@gmail.com";
    const practitionerHtml = buildPractitionerNotificationHtml(details);

    const { error: pracError } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [practitionerEmail],
      subject: `New Booking Confirmed: ${details.customerName} (${details.sessionName})`,
      html: practitionerHtml,
    });

    if (pracError) {
      console.error("[Notifications] Failed to send practitioner notification email:", pracError);
    } else {
      practitionerSent = true;
    }
  } catch (err) {
    console.error("[Notifications] Exception sending practitioner notification email:", err);
  }

  return { clientSent, practitionerSent };
}
