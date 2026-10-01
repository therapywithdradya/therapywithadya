/**
 * Hand-written row types for the phase 2 schema.
 * Jsonb function results use the keys the SQL functions actually return.
 * Timestamps inside jsonb are ISO strings.
 */

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "failed";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refund_pending"
  | "refunded";

export type CancelReason = "hold_expired" | "operator" | "customer_request";

export type CalendarSyncStatus = "not_required" | "pending" | "created" | "failed";

export type EventKind = "event" | "workshop";

export type BookingRow = {
  id: string;
  public_token_hash: string;
  session_slug: string;
  session_name: string;
  amount_paise: number;
  currency: "INR";
  duration_minutes: number;
  buffer_minutes: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_note: string | null;
  starts_at: string;
  ends_at: string;
  blocked_until: string;
  timezone: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  hold_expires_at: string | null;
  cancel_reason: CancelReason | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  google_event_id: string | null;
  calendar_sync_status: CalendarSyncStatus;
  calendar_attempts: number;
  calendar_error: string | null;
  needs_manual_review: boolean;
  review_reason: string | null;
  admin_note: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentEventRow = {
  razorpay_event_id: string;
  event_type: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  received_at: string;
  processed_at: string | null;
};

export type RateLimitRow = {
  key_hash: string;
  window_start: string;
  count: number;
};

export type TestimonialRow = {
  id: string;
  display_name: string;
  quote: string;
  rating: number | null;
  is_approved: boolean;
  sort_order: number;
  created_at: string;
};

export type EventWorkshopRow = {
  id: string;
  slug: string;
  kind: EventKind;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  image_path: string | null;
  is_published: boolean;
  created_at: string;
};

export type GalleryItemRow = {
  id: string;
  image_path: string;
  alt_text: string;
  caption: string | null;
  category: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type BookedRangeRow = {
  start_at: string;
  blocked_until: string;
};

export type CreatePendingBookingSuccess = {
  ok: true;
  booking: {
    id: string;
    session_name: string;
    start_at: string;
    end_at: string;
    price_paise: number;
    currency: "INR";
    hold_expires_at: string;
  };
};

export type CreatePendingBookingFailure = {
  ok: false;
  code:
    | "invalid_price"
    | "invalid_duration"
    | "invalid_buffer"
    | "invalid_timezone"
    | "invalid_time"
    | "invalid_input"
    | "invalid_token"
    | "slot_taken"
    | "token_conflict";
};

export type CreatePendingBookingResult =
  | CreatePendingBookingSuccess
  | CreatePendingBookingFailure;

export type AttachRazorpayOrderResult = {
  ok: boolean;
  code:
    | "attached"
    | "already_attached"
    | "booking_not_found"
    | "not_pending"
    | "hold_expired"
    | "order_mismatch"
    | "order_conflict";
  booking_id: string | null;
};

export type ConfirmBookingPaymentCode =
  | "order_not_found"
  | "already_confirmed"
  | "duplicate_payment"
  | "paid_slot_lost"
  | "amount_mismatch"
  | "confirmed"
  | "paid_but_cancelled"
  | "payment_id_conflict";

export type ConfirmBookingPaymentResult = {
  ok: boolean;
  code: ConfirmBookingPaymentCode;
  booking_id: string | null;
  already_confirmed: boolean;
};

export type MarkPaymentFailedResult = {
  ok: boolean;
  code: "order_not_found" | "marked_failed" | "unchanged";
};

export type MarkCalendarSyncedResult = {
  ok: boolean;
  code: "synced" | "booking_not_found" | "invalid_input" | "event_id_conflict";
};

export type MarkCalendarFailedResult = {
  ok: boolean;
  code: "recorded" | "booking_not_found";
  calendar_attempts: number | null;
  needs_manual_review: boolean | null;
};

export type BookingByTokenSuccess = {
  ok: true;
  booking: {
    booking_status: BookingStatus;
    payment_status: PaymentStatus;
    session_name: string;
    start_at: string;
    end_at: string;
    timezone: string;
    customer_name: string;
    razorpay_order_id: string | null;
    id: string;
    hold_expires_at: string | null;
    calendar_sync_status: CalendarSyncStatus;
  };
};

export type BookingByTokenResult =
  | BookingByTokenSuccess
  | { ok: false; code: "not_found" };

export type CheckRateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type BookingInsert = WithOptional<
  BookingRow,
  | "id"
  | "currency"
  | "buffer_minutes"
  | "customer_note"
  | "timezone"
  | "booking_status"
  | "payment_status"
  | "hold_expires_at"
  | "cancel_reason"
  | "razorpay_order_id"
  | "razorpay_payment_id"
  | "google_event_id"
  | "calendar_sync_status"
  | "calendar_attempts"
  | "calendar_error"
  | "needs_manual_review"
  | "review_reason"
  | "admin_note"
  | "confirmed_at"
  | "cancelled_at"
  | "created_at"
  | "updated_at"
>;

export type BookingUpdate = Partial<BookingRow>;

export type PaymentEventInsert = WithOptional<
  PaymentEventRow,
  "razorpay_order_id" | "razorpay_payment_id" | "received_at" | "processed_at"
>;

export type TestimonialInsert = WithOptional<
  TestimonialRow,
  "id" | "rating" | "is_approved" | "sort_order" | "created_at"
>;

export type EventWorkshopInsert = WithOptional<
  EventWorkshopRow,
  "id" | "ends_at" | "location" | "image_path" | "is_published" | "created_at"
>;

export type GalleryItemInsert = WithOptional<
  GalleryItemRow,
  "id" | "caption" | "category" | "sort_order" | "is_published" | "created_at"
>;

type Table<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      bookings: Table<BookingRow, BookingInsert, BookingUpdate>;
      payment_events: Table<PaymentEventRow, PaymentEventInsert>;
      rate_limits: Table<RateLimitRow, RateLimitRow, Partial<RateLimitRow>>;
      testimonials: Table<TestimonialRow, TestimonialInsert>;
      events_workshops: Table<EventWorkshopRow, EventWorkshopInsert>;
      gallery_items: Table<GalleryItemRow, GalleryItemInsert>;
    };
    Views: Record<string, never>;
    Functions: {
      expire_stale_pending_bookings: {
        Args: Record<string, never>;
        Returns: number;
      };
      create_pending_booking: {
        Args: {
          p_session_slug: string;
          p_session_name: string;
          p_price_paise: number;
          p_duration_minutes: number;
          p_buffer_minutes: number;
          p_start_at: string;
          p_customer_name: string;
          p_customer_email: string;
          p_customer_phone: string;
          p_customer_note: string | null;
          p_timezone: string;
          p_token_hash: string;
        };
        Returns: CreatePendingBookingResult;
      };
      attach_razorpay_order: {
        Args: { p_booking_id: string; p_order_id: string };
        Returns: AttachRazorpayOrderResult;
      };
      confirm_booking_payment: {
        Args: {
          p_razorpay_order_id: string;
          p_razorpay_payment_id: string;
          p_amount_paise: number;
          p_currency: string;
        };
        Returns: ConfirmBookingPaymentResult;
      };
      mark_payment_failed: {
        Args: { p_razorpay_order_id: string };
        Returns: MarkPaymentFailedResult;
      };
      record_razorpay_event: {
        Args: {
          p_event_id: string;
          p_event_type: string;
          p_order_id: string | null;
          p_payment_id: string | null;
        };
        Returns: boolean;
      };
      mark_razorpay_event_processed: {
        Args: { p_event_id: string };
        Returns: boolean;
      };
      mark_calendar_synced: {
        Args: { p_booking_id: string; p_google_event_id: string };
        Returns: MarkCalendarSyncedResult;
      };
      mark_calendar_failed: {
        Args: { p_booking_id: string; p_error: string | null };
        Returns: MarkCalendarFailedResult;
      };
      get_booked_ranges: {
        Args: { p_from: string; p_to: string };
        Returns: BookedRangeRow[];
      };
      get_booking_by_token_hash: {
        Args: { p_token_hash: string };
        Returns: BookingByTokenResult;
      };
      check_rate_limit: {
        Args: {
          p_key_hash: string;
          p_limit: number;
          p_window_seconds: number;
        };
        Returns: CheckRateLimitResult;
      };
      purge_old_rate_limits: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
};
