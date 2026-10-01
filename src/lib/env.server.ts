import "server-only";

import { z, type infer as ZodInfer, type ZodType } from "zod";

/**
 * Lazy server environment. Each getter validates only its own variables and
 * throws only when that feature is used. Importing this module during a build
 * does not read Razorpay, Google, or Supabase settings.
 * Errors name the variable. They never include the value.
 */

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const razorpayEnvSchema = z.object({
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
});

const googleEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_CALENDAR_ID: z.string().min(1),
});

const cronEnvSchema = z.object({
  CRON_SECRET: z.string().min(1),
});

const businessTimezoneSchema = z.object({
  BUSINESS_TIMEZONE: z.string().min(1),
});

export type SupabaseEnv = ZodInfer<typeof supabaseEnvSchema>;
export type RazorpayEnv = ZodInfer<typeof razorpayEnvSchema>;
export type GoogleEnv = ZodInfer<typeof googleEnvSchema>;
export type CronEnv = ZodInfer<typeof cronEnvSchema>;
export type BusinessTimezoneEnv = ZodInfer<typeof businessTimezoneSchema>;

export type RateLimitEnv = {
  availabilityLimit: number;
  availabilityWindowSeconds: number;
  bookingLimit: number;
  bookingWindowSeconds: number;
};

function readFeature<T>(
  feature: string,
  schema: ZodType<T>,
  values: Record<string, string | undefined>,
): T {
  const parsed = schema.safeParse(values);
  if (parsed.success) {
    return parsed.data;
  }

  const names = [
    ...new Set(
      parsed.error.issues
        .map((issue) => issue.path.map((part) => String(part)).join("."))
        .filter((name) => name.length > 0),
    ),
  ];

  throw new Error(
    `${feature} is not configured. Check: ${names.join(", ") || feature}.`,
  );
}

export function getSupabaseEnv(): SupabaseEnv {
  return readFeature("Supabase", supabaseEnvSchema, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export function getRazorpayEnv(): RazorpayEnv {
  return readFeature("Razorpay", razorpayEnvSchema, {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  });
}

export function getGoogleEnv(): GoogleEnv {
  return readFeature("Google Calendar", googleEnvSchema, {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
  });
}

export function getCronEnv(): CronEnv {
  return readFeature("Cron", cronEnvSchema, {
    CRON_SECRET: process.env.CRON_SECRET,
  });
}

export function getBusinessTimezoneEnv(): BusinessTimezoneEnv {
  return readFeature("Business timezone", businessTimezoneSchema, {
    BUSINESS_TIMEZONE: process.env.BUSINESS_TIMEZONE,
  });
}

/**
 * Limits live in code until a later phase tunes them. There is no rate-limit
 * secret in .env.example, so this getter does not throw when other features
 * are unset.
 */
export function getRateLimitEnv(): RateLimitEnv {
  return {
    availabilityLimit: 30,
    availabilityWindowSeconds: 5 * 60,
    bookingLimit: 8,
    bookingWindowSeconds: 10 * 60,
  };
}
