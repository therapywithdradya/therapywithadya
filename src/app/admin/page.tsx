"use client";

import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";
import { Container } from "@/components/ui/container";

type ProfileData = {
  name: string;
  tagline: string;
  about_title: string;
  about_intro: string;
  profile_image_url: string;
  hero_image_url: string;
  email: string;
  phone: string | null;
  location: string;
  fee_60_min: number;
  fee_90_min: number;
};

type EventItem = {
  id: string;
  slug: string;
  kind: "event" | "workshop";
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  image_path: string | null;
  is_published: boolean;
};

type GalleryItem = {
  id: string;
  image_path: string;
  alt_text: string;
  caption: string | null;
  category: string | null;
  sort_order: number;
  is_published: boolean;
};

type GalleryCategoryItem = {
  slug: string;
  label: string;
  sort_order: number;
};

type TestimonialItem = {
  id: string;
  display_name: string;
  quote: string;
  rating: number | null;
  is_approved: boolean;
  sort_order: number;
};

type BookingItem = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  session_name: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  booking_status: string;
  payment_status: string;
  amount_paise: number;
  customer_note: string | null;
  created_at: string;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-muted/60 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]";

const selectClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]";

const textareaClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-muted/60 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40";



export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "profile" | "events" | "gallery" | "reviews" | "bookings"
  >("profile");
  const [currentTimestamp] = useState(() => Date.now());

  // Notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<ProfileData>({
    name: "Dr. Adya Vats",
    tagline: "A safe, compassionate, and trauma-informed space to heal.",
    about_title: "About Dr. Adya Vats",
    about_intro:
      "I am a trauma-informed psychologist with over 3+ years of clinical practice and 5+ years of dedicated academic study and research.",
    profile_image_url: "/images/dr-adya-portrait.jpg",
    hero_image_url: "/images/hero-space.jpg",
    email: "adyavats13@gmail.com",
    phone: "",
    location: "Online Sessions (Worldwide) & In-Person by Appointment",
    fee_60_min: 1500,
    fee_90_min: 2500,
  });

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    kind: "workshop" as "workshop" | "event",
    starts_at: "",
    ends_at: "",
    location: "Online (Google Meet)",
    description: "",
    image_path: "",
  });

  // Gallery State
  const [categoriesList, setCategoriesList] = useState<GalleryCategoryItem[]>([
    { slug: "space", label: "Therapy Space & Sanctuary", sort_order: 1 },
    { slug: "workshop", label: "Workshops & Speaking", sort_order: 2 },
    { slug: "modalities", label: "Therapeutic Modalities & Tools", sort_order: 3 },
    { slug: "practice", label: "Clinical Practice", sort_order: 4 },
    { slug: "credentials", label: "Credentials & Certifications", sort_order: 5 },
  ]);
  const [isCategoryOrderChanged, setIsCategoryOrderChanged] = useState<boolean>(false);
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [editCategoryLabel, setEditCategoryLabel] = useState<string>("");
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [newGalleryPhoto, setNewGalleryPhoto] = useState({
    image_path: "",
    caption: "",
    category: "space",
    alt_text: "Dr. Adya clinical practice photo",
  });

  // Reviews State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [newReview, setNewReview] = useState({
    display_name: "",
    quote: "",
    rating: 5,
  });

  // Bookings State
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  // File upload refs
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const heroPicInputRef = useRef<HTMLInputElement>(null);
  const galleryPicInputRef = useRef<HTMLInputElement>(null);
  const eventPicInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Fetch dashboard data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load Profile
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile((prev) => ({ ...prev, ...data.profile }));
        }
      })
      .catch(() => {});

    // Load Events
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.events) setEvents(data.events);
      })
      .catch(() => {});

    // Load Gallery Categories
    fetch("/api/admin/gallery/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategoriesList(data.categories);
        }
      })
      .catch(() => {});

    // Load Gallery
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setGallery(data.items);
      })
      .catch(() => {});

    // Load Reviews
    fetch("/api/admin/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials) setTestimonials(data.testimonials);
      })
      .catch(() => {});

    // Load Bookings
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Upload helper
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
  ) => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      onSuccess(data.url);
      showToast("success", "Photo uploaded successfully!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsSaving(false);
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message || "Invalid passcode.");
      }
    } catch {
      setLoginError("Failed to reach server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setIsAuthenticated(false);
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      showToast("success", "Practice Profile & Fees saved successfully!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Add Event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.starts_at) {
      showToast("error", "Please provide a title and start date/time.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");
      setEvents((prev) => [data.event, ...prev]);
      setNewEvent({
        title: "",
        kind: "workshop",
        starts_at: "",
        ends_at: "",
        location: "Online (Google Meet)",
        description: "",
        image_path: "",
      });
      showToast("success", "New event published successfully!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error adding event");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        showToast("success", "Event deleted.");
      }
    } catch {
      showToast("error", "Failed to delete event.");
    }
  };

  // Reorder category (Move Up / Move Down)
  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;
    const next = [...categoriesList];
    const moved = next[index];
    if (!moved) return;
    next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    const reindexed = next.map((c, i) => ({ ...c, sort_order: i + 1 }));
    setCategoriesList(reindexed);
    setIsCategoryOrderChanged(true);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedCategoryIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedCategoryIndex === null || draggedCategoryIndex === dropIndex) {
      setDraggedCategoryIndex(null);
      return;
    }
    const next = [...categoriesList];
    const moved = next[draggedCategoryIndex];
    if (!moved) {
      setDraggedCategoryIndex(null);
      return;
    }
    next.splice(draggedCategoryIndex, 1);
    next.splice(dropIndex, 0, moved);
    const reindexed = next.map((c, i) => ({ ...c, sort_order: i + 1 }));
    setCategoriesList(reindexed);
    setIsCategoryOrderChanged(true);
    setDraggedCategoryIndex(null);
  };

  // Save Category Order ("Save Format")
  const handleSaveCategoryOrder = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/gallery/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: categoriesList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category order");
      if (data.categories) {
        setCategoriesList(data.categories);
      }
      setIsCategoryOrderChanged(false);
      showToast(
        "success",
        "Category order saved! The website gallery now renders in this exact format.",
      );
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error saving category order");
    } finally {
      setIsSaving(false);
    }
  };

  // Add Category (Default added to bottom)
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newCategoryName.trim();
    if (!raw) {
      showToast("error", "Please enter a category name.");
      return;
    }
    const slug = raw.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/gallery/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: raw, slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add category");

      const newCat: GalleryCategoryItem = data.category || {
        slug,
        label: raw,
        sort_order: categoriesList.length + 1,
      };

      setCategoriesList((prev) => {
        const without = prev.filter((c) => c.slug !== newCat.slug);
        return [...without, newCat];
      });
      setNewGalleryPhoto((prev) => ({ ...prev, category: newCat.slug }));
      setNewCategoryName("");
      showToast(
        "success",
        `Category "${raw}" added at the bottom! Drag or move to change position.`,
      );
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error adding category");
    } finally {
      setIsSaving(false);
    }
  };

  // Rename Category
  const handleStartEditCategory = (cat: GalleryCategoryItem) => {
    setEditingCategorySlug(cat.slug);
    setEditCategoryLabel(cat.label);
  };

  const handleSaveRenameCategory = async (oldSlug: string) => {
    const trimmed = editCategoryLabel.trim();
    if (!trimmed) {
      showToast("error", "Category name cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/gallery/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldSlug, newLabel: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename category");

      setCategoriesList((prev) =>
        prev.map((c) => (c.slug === oldSlug ? { ...c, label: trimmed } : c)),
      );
      setEditingCategorySlug(null);
      showToast("success", `Category renamed to "${trimmed}"!`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error renaming category");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat: GalleryCategoryItem) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${cat.label}"?\nAll gallery photos in this category will also be deleted from the website.`,
      )
    ) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery/categories?slug=${encodeURIComponent(cat.slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      setCategoriesList((prev) => prev.filter((c) => c.slug !== cat.slug));
      setGallery((prev) => prev.filter((p) => p.category?.toLowerCase() !== cat.slug.toLowerCase()));
      if (newGalleryPhoto.category === cat.slug) {
        setNewGalleryPhoto((prev) => ({
          ...prev,
          category: categoriesList[0]?.slug || "space",
        }));
      }
      showToast("success", `Category "${cat.label}" deleted.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error deleting category");
    } finally {
      setIsSaving(false);
    }
  };

  // Add Gallery Photo
  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryPhoto.image_path) {
      showToast("error", "Please upload or provide an image URL.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGalleryPhoto),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add photo");
      setGallery((prev) => [data.item, ...prev]);
      setNewGalleryPhoto((prev) => ({
        image_path: "",
        caption: "",
        category: prev.category,
        alt_text: "Dr. Adya clinical practice photo",
      }));
      showToast("success", "Photo added to category!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error adding photo");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGallery((prev) => prev.filter((item) => item.id !== id));
        showToast("success", "Gallery image removed.");
      }
    } catch {
      showToast("error", "Failed to delete gallery item.");
    }
  };

  // Add Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.display_name || !newReview.quote) {
      showToast("error", "Please provide client name and review quote.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add review");
      setTestimonials((prev) => [data.testimonial, ...prev]);
      setNewReview({ display_name: "", quote: "", rating: 5 });
      showToast("success", "Client review added successfully!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error adding review");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Review Approval
  const handleToggleReviewApproval = async (item: TestimonialItem) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: !item.is_approved }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, is_approved: !t.is_approved } : t)),
        );
        showToast("success", item.is_approved ? "Review hidden from site" : "Review approved!");
      }
    } catch {
      showToast("error", "Failed to update review.");
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((item) => item.id !== id));
        showToast("success", "Review deleted.");
      }
    } catch {
      showToast("error", "Failed to delete review.");
    }
  };

  // 1. Loading state check
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // 2. Not Authenticated: Render Login Box
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
          <div className="text-center">
            <span className="inline-block rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Practitioner Portal
            </span>
            <h1 className="mt-3 font-heading text-2xl font-bold text-ink">
              Dr. Adya Practice Console
            </h1>
            <p className="mt-2 text-sm text-muted">
              Enter your secure passcode to update your profile, events, gallery, and client reviews.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-passcode" className="block text-sm font-medium text-ink">
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-ink placeholder:text-muted/60 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            {loginError && (
              <p className="rounded-md border border-red-800 bg-red-950/60 p-2 text-sm text-red-300">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-primary py-2.5 text-center font-semibold text-on-primary shadow-soft transition-all hover:bg-primary-hover disabled:opacity-50"
            >
              {isSaving ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Therapy with Dr. Adya Vats • Confidential & Encrypted
          </p>
        </div>
      </div>
    );
  }

  // Date boundary calculation for events (pure reference)
  const upcomingEvents = events.filter((e) => {
    const endOrStart = e.ends_at ?? e.starts_at;
    return Date.parse(endOrStart) >= currentTimestamp;
  });

  const pastEvents = events.filter((e) => {
    const endOrStart = e.ends_at ?? e.starts_at;
    return Date.parse(endOrStart) < currentTimestamp;
  });

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <Container>
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
                Dr. Adya Practice Console
              </h1>
              <span className="rounded-full border border-emerald-800/60 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Connected
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Instantly update your website without needing code or developer assistance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink shadow-xs hover:border-primary/50 hover:text-primary transition-colors"
            >
              View Live Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-900/50 bg-red-950/40 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Global Toast Feedback */}
        {feedback && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm font-medium transition-all shadow-card ${
              feedback.type === "success"
                ? "border border-emerald-800 bg-[#0f2417] text-emerald-300"
                : "border border-red-800 bg-[#2a1215] text-red-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
          {(
            [
              { key: "profile", label: "👤 Profile & Fees", count: null },
              { key: "events", label: "📅 Events & Workshops", count: events.length },
              { key: "gallery", label: "🖼️ Photo Gallery", count: gallery.length },
              { key: "reviews", label: "💬 Client Reviews", count: testimonials.length },
              { key: "bookings", label: "📋 Appointments", count: bookings.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-on-primary font-semibold shadow-soft"
                  : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-ink"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.key
                      ? "bg-on-primary/15 text-on-primary font-bold"
                      : "border border-border bg-background text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: PROFILE & FEES */}
        {activeTab === "profile" && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="border-b border-border pb-4">
              <h2 className="font-heading text-xl font-bold text-ink">
                Profile Photos, Bio & Session Fees
              </h2>
              <p className="mt-1 text-sm text-muted">
                Changes saved here immediately update the homepage, about section, and contact card.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
              {/* Media Uploads Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Profile Photo */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <span className="block text-sm font-semibold text-ink">Profile Portrait</span>
                  <p className="text-xs text-muted">Displayed on About Dr. Adya and Hero section</p>

                  <div className="mt-3 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.profile_image_url}
                      alt="Profile preview"
                      className="h-20 w-20 rounded-full border border-border object-cover shadow-xs"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={profilePicInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              setProfile((p) => ({ ...p, profile_image_url: url }));
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => profilePicInputRef.current?.click()}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-xs hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        Change Photo
                      </button>
                      <p className="mt-1 text-[11px] text-muted">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Hero / Space Image */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <span className="block text-sm font-semibold text-ink">
                    Practice / Sanctuary Photo
                  </span>
                  <p className="text-xs text-muted">Hero background and clinical space preview</p>

                  <div className="mt-3 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.hero_image_url}
                      alt="Hero preview"
                      className="h-20 w-32 rounded-lg border border-border object-cover shadow-xs"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={heroPicInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              setProfile((p) => ({ ...p, hero_image_url: url }));
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => heroPicInputRef.current?.click()}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-xs hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        Change Photo
                      </button>
                      <p className="mt-1 text-[11px] text-muted">Landscape aspect ratio recommended</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Details Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-ink">Practitioner Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink">Contact Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink">Tagline / Mission</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink">
                    About Intro (First Impressions)
                  </label>
                  <textarea
                    rows={4}
                    value={profile.about_intro}
                    onChange={(e) => setProfile({ ...profile, about_intro: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink">
                    Practice Location & Mode
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink">
                    Direct Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>

                {/* Session Fees */}
                <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
                  <h3 className="text-sm font-semibold text-ink">Session Fees Configuration</h3>
                  <p className="text-xs text-muted">
                    Controls fee display and booking checkout calculations.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-ink">
                        60-Minute Session Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={profile.fee_60_min}
                        onChange={(e) =>
                          setProfile({ ...profile, fee_60_min: Number(e.target.value) })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink">
                        90-Minute Session Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={profile.fee_90_min}
                        onChange={(e) =>
                          setProfile({ ...profile, fee_90_min: Number(e.target.value) })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary shadow-soft transition-all hover:bg-primary-hover disabled:opacity-50"
                >
                  {isSaving ? "Saving changes..." : "Save Profile & Settings"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: EVENTS & WORKSHOPS */}
        {activeTab === "events" && (
          <div className="mt-8 space-y-8">
            {/* Create Event Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <h2 className="font-heading text-xl font-bold text-ink">Add New Event or Workshop</h2>
              <p className="mt-1 text-sm text-muted">
                Published events will appear on the public /events page. Once an event date passes,
                it will automatically transition into the &ldquo;Past Events&rdquo; section without manual intervention.
              </p>

              <form onSubmit={handleAddEvent} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink">Title</label>
                    <input
                      type="text"
                      required
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="e.g. Navigating Burnout Workshop"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Event Kind</label>
                    <select
                      value={newEvent.kind}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, kind: e.target.value as "workshop" | "event" })
                      }
                      className={selectClass}
                    >
                      <option value="workshop" className="bg-background text-ink">Workshop</option>
                      <option value="event" className="bg-background text-ink">Event / Talk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.starts_at}
                      onChange={(e) => setNewEvent({ ...newEvent, starts_at: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">
                      End Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvent.ends_at}
                      onChange={(e) => setNewEvent({ ...newEvent, ends_at: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Location / Platform</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Online (Google Meet) or In-Person Venue"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Event Banner Image</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="text"
                        value={newEvent.image_path}
                        onChange={(e) => setNewEvent({ ...newEvent, image_path: e.target.value })}
                        placeholder="Image URL or upload"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-muted/60 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={eventPicInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              setNewEvent((prev) => ({ ...prev, image_path: url }));
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => eventPicInputRef.current?.click()}
                        className="whitespace-nowrap rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-ink">Description</label>
                    <textarea
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Details about who this workshop is for, key learnings, and registration info."
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-all"
                  >
                    + Publish Event
                  </button>
                </div>
              </form>
            </div>

            {/* Upcoming Events List */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold text-ink">
                  Upcoming Events ({upcomingEvents.length})
                </h3>
                <span className="text-xs text-muted">Currently active on the website</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="mt-6 text-sm text-muted">
                  No upcoming events right now. Create one above to show it to clients.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-border">
                  {upcomingEvents.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {item.image_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_path}
                            alt=""
                            className="h-14 w-20 rounded-md object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-md border border-border bg-background text-xs text-muted">
                            No photo
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary capitalize">
                              {item.kind}
                            </span>
                            <h4 className="font-semibold text-ink text-sm sm:text-base">
                              {item.title}
                            </h4>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">
                            📅 {new Date(item.starts_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })} • 📍 {item.location || "Online"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteEvent(item.id)}
                          className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Events List */}
            {pastEvents.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-heading text-lg font-bold text-ink">
                    Past Events ({pastEvents.length})
                  </h3>
                  <span className="text-xs text-muted">
                    Automatically moved here because their date passed
                  </span>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {pastEvents.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between opacity-80"
                    >
                      <div>
                        <h4 className="font-medium text-ink text-sm">{item.title}</h4>
                        <p className="text-xs text-muted">
                          Finished on {new Date(item.starts_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(item.id)}
                        className="self-start sm:self-center rounded-lg border border-red-900/50 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GALLERY MANAGER */}
        {activeTab === "gallery" && (
          <div className="mt-8 space-y-8">
            {/* OPTION 1: CUSTOMIZE CATEGORY SEQUENCE & MANAGE CATEGORIES */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Option 1
                    </span>
                    {isCategoryOrderChanged && (
                      <span className="animate-pulse rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                        Unsaved Sequence
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-xl font-bold text-ink mt-1">
                    Customize Category Sequence &amp; Format
                  </h2>
                  <p className="mt-1 text-xs text-muted max-w-[70ch]">
                    Drag or use ▲ / ▼ to set where each category appears on the website. New categories are added to the bottom by default. Click <strong className="text-primary font-medium">Save Category Order</strong> to render the updated sequence on the live gallery. Preexisting categories can also be edited or deleted.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCategoryOrder}
                    disabled={isSaving}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-soft transition-all disabled:opacity-50 ${
                      isCategoryOrderChanged
                        ? "bg-primary text-on-primary hover:bg-primary-hover ring-2 ring-primary/50"
                        : "border border-border bg-background text-ink hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    💾 Save Category Order
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSaving(true);
                      fetch("/api/admin/gallery/categories")
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.categories) {
                            setCategoriesList(data.categories);
                            setIsCategoryOrderChanged(false);
                            showToast("success", "Categories refreshed from database!");
                          }
                        })
                        .catch(() => showToast("error", "Failed to reload categories."))
                        .finally(() => setIsSaving(false));
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* Order Alert Banner if Changed */}
              {isCategoryOrderChanged && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span>
                      You rearranged the category sequence! Click <strong>&quot;Save Category Order&quot;</strong> to apply this new layout to the public gallery page.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCategoryOrder}
                    disabled={isSaving}
                    className="self-end sm:self-center whitespace-nowrap rounded-md bg-amber-500 px-3 py-1 font-semibold text-black hover:bg-amber-400 transition-colors"
                  >
                    Save Format
                  </button>
                </div>
              )}

              {/* Ordered Categories List with Drag & Drop and Controls */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-muted px-1">
                  <span>Display Sequence (Top of Page to Bottom)</span>
                  <span>Position &amp; Actions</span>
                </div>

                {categoriesList.map((cat, index) => {
                  const isEditing = editingCategorySlug === cat.slug;
                  const isDragged = draggedCategoryIndex === index;

                  return (
                    <div
                      key={cat.slug}
                      draggable={!isEditing}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className={`flex flex-col gap-3 rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center sm:justify-between ${
                        isDragged
                          ? "opacity-50 border-primary border-dashed bg-primary/10"
                          : "border-border bg-background/80 hover:border-border/80"
                      }`}
                    >
                      {/* Left: Position handle + Title / Edit mode */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Drag Handle */}
                        <div
                          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-ink active:cursor-grabbing select-none"
                          title="Click and drag to reorder category"
                        >
                          ⠿
                        </div>

                        {/* Order Number Badge */}
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-border text-xs font-bold text-primary shrink-0">
                          #{index + 1}
                        </span>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editCategoryLabel}
                              onChange={(e) => setEditCategoryLabel(e.target.value)}
                              className="w-full rounded-lg border border-primary bg-surface px-3 py-1.5 text-sm text-ink shadow-xs focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveRenameCategory(cat.slug);
                                } else if (e.key === "Escape") {
                                  setEditingCategorySlug(null);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRenameCategory(cat.slug)}
                              disabled={isSaving}
                              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategorySlug(null)}
                              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted hover:text-ink transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <span className="font-semibold text-sm text-ink truncate">
                              {cat.label}
                            </span>
                            <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted font-mono">
                              {cat.slug}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Reorder & Edit / Delete Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {/* Up Button */}
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(index, "up")}
                          disabled={index === 0}
                          title="Move category up on page"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                          ▲
                        </button>

                        {/* Down Button */}
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(index, "down")}
                          disabled={index === categoriesList.length - 1}
                          title="Move category down on page"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                          ▼
                        </button>

                        {/* Rename / Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(cat)}
                          title="Rename this category"
                          className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          title="Delete this category and its photos"
                          className="flex h-8 items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/30 px-2.5 text-xs font-medium text-red-300 hover:bg-red-900/50 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Category Form (Appends to bottom by default) */}
              <form
                onSubmit={handleAddCategory}
                className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 border-t border-border"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name (e.g. Mindfulness Retreats, Youth Seminars, Art Therapy)"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    New categories are added to the bottom by default. You can drag or move them up to any desired position.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-soft hover:bg-primary-hover transition-all whitespace-nowrap mt-1.5 disabled:opacity-50"
                >
                  + Add to Bottom
                </button>
              </form>
            </div>

            {/* OPTION 2: ADD IMAGES TO ANY CATEGORY */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Option 2</span>
                <h2 className="font-heading text-xl font-bold text-ink mt-0.5">Add Images to Any Category</h2>
                <p className="mt-1 text-xs text-muted">
                  Upload an image and choose which category it belongs to. Images added to preexisting categories will append cleanly to that section without changing category order.
                </p>
              </div>

              <form onSubmit={handleAddGalleryPhoto} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink">Image File</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={newGalleryPhoto.image_path}
                        onChange={(e) =>
                          setNewGalleryPhoto({ ...newGalleryPhoto, image_path: e.target.value })
                        }
                        placeholder="Upload an image or paste URL"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-muted/60 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={galleryPicInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              setNewGalleryPhoto((prev) => ({ ...prev, image_path: url }));
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => galleryPicInputRef.current?.click()}
                        className="whitespace-nowrap rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Category</label>
                    <select
                      value={newGalleryPhoto.category}
                      onChange={(e) =>
                        setNewGalleryPhoto({ ...newGalleryPhoto, category: e.target.value })
                      }
                      className={selectClass}
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.slug} value={cat.slug} className="bg-background text-ink">
                          {cat.label} ({cat.slug})
                        </option>
                      ))}
                    </select>
                    {/* Quick selection pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categoriesList.map((cat) => (
                        <button
                          type="button"
                          key={cat.slug}
                          onClick={() => {
                            setNewGalleryPhoto((prev) => ({ ...prev, category: cat.slug }));
                            showToast("success", `Selected category "${cat.label}"`);
                          }}
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] transition-all ${
                            newGalleryPhoto.category === cat.slug
                              ? "border-primary bg-primary/20 text-primary font-semibold"
                              : "border-border bg-background text-muted hover:border-primary/40 hover:text-ink"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-ink">
                      Caption / Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={newGalleryPhoto.caption}
                      onChange={(e) =>
                        setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })
                      }
                      placeholder="e.g. Sisyphus Discussion Poster or Tranquil Counseling Corner"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-all"
                  >
                    + Add to &ldquo;{categoriesList.find((c) => c.slug === newGalleryPhoto.category)?.label || newGalleryPhoto.category}&rdquo; Category
                  </button>
                </div>
              </form>
            </div>


            {/* Gallery Grid */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold text-ink">
                  Current Gallery ({gallery.length} Photos)
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      if (!confirm("Load the standard clinic photos into your gallery and clean up dummy cards?")) return;
                      setIsSaving(true);
                      try {
                        const res = await fetch("/api/admin/gallery", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "seed_real_photos" }),
                        });
                        const data = await res.json();
                        if (data.items) setGallery(data.items);
                        showToast("success", "Practice photos loaded successfully!");
                      } catch {
                        showToast("error", "Failed to load photos.");
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    ✨ Load Practice Photos
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      if (!confirm("Clean up and remove dummy placeholder SVGs from seed.sql?")) return;
                      setIsSaving(true);
                      try {
                        const res = await fetch("/api/admin/gallery", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "clean_placeholders" }),
                        });
                        const data = await res.json();
                        if (data.items) setGallery(data.items);
                        showToast("success", "Dummy placeholders removed!");
                      } catch {
                        showToast("error", "Failed to clean placeholders.");
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors disabled:opacity-50"
                  >
                    Remove Dummy Placeholders
                  </button>
                </div>
              </div>


              {gallery.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  Your gallery is currently empty or using fallback photos. Upload your first picture above!
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-border bg-background shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_path}
                        alt={item.alt_text}
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="p-2.5">
                        <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted uppercase">
                          {item.category || "practice"}
                        </span>
                        {item.caption && (
                          <p className="mt-1 truncate text-xs text-ink">{item.caption}</p>
                        )}
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="mt-2 w-full rounded border border-red-900/50 bg-red-950/40 py-1 text-center text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT REVIEWS */}
        {activeTab === "reviews" && (
          <div className="mt-8 space-y-8">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <h2 className="font-heading text-xl font-bold text-ink">Add Client Testimonial</h2>
              <p className="mt-1 text-sm text-muted">
                Add feedback received from counseling sessions or workshops. Client anonymity can be preserved using initials (e.g. &ldquo;P. S., Delhi&rdquo;).
              </p>

              <form onSubmit={handleAddReview} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink">Client Display Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.display_name}
                      onChange={(e) =>
                        setNewReview({ ...newReview, display_name: e.target.value })
                      }
                      placeholder="e.g. Ananya S., 26 or Client Reflection"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink">Star Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({ ...newReview, rating: Number(e.target.value) })
                      }
                      className={selectClass}
                    >
                      <option value="5" className="bg-background text-ink">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4" className="bg-background text-ink">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3" className="bg-background text-ink">⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-ink">Review Quote</label>
                    <textarea
                      rows={3}
                      required
                      value={newReview.quote}
                      onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                      placeholder="Dr. Adya created such a welcoming and grounded space..."
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-all"
                  >
                    + Publish Review
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <h3 className="font-heading text-lg font-bold text-ink">
                Testimonials & Client Reflections ({testimonials.length})
              </h3>

              {testimonials.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  No custom reviews added yet. Dummy reviews are shown on the homepage until you add your own.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-border">
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink text-sm">
                            {item.display_name}
                          </span>
                          <span className="text-primary text-xs">
                            {"★".repeat(item.rating || 5)}
                          </span>
                          {!item.is_approved && (
                            <span className="rounded border border-amber-800/60 bg-amber-950/80 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs italic text-muted">&ldquo;{item.quote}&rdquo;</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReviewApproval(item)}
                          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          {item.is_approved ? "Hide from Site" : "Approve & Show"}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(item.id)}
                          className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: APPOINTMENTS & BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="border-b border-border pb-4">
              <h2 className="font-heading text-xl font-bold text-ink">
                Appointments & Booking Ledger
              </h2>
              <p className="mt-1 text-sm text-muted">
                Recent sessions scheduled through the website booking wizard. All sessions automatically sync to your connected Google Calendar.
              </p>
            </div>

            {bookings.length === 0 ? (
              <p className="mt-6 text-sm text-muted">
                No bookings recorded yet. Once a client books a session, it will show up here.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted uppercase">
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Session</th>
                      <th className="pb-3 font-semibold">Date & Time</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-background/40 transition-colors">
                        <td className="py-3">
                          <span className="font-semibold text-ink block">{b.customer_name}</span>
                          <span className="text-muted text-[11px] block">{b.customer_email}</span>
                          <span className="text-muted text-[11px] block">{b.customer_phone}</span>
                        </td>
                        <td className="py-3 text-ink">{b.session_name}</td>
                        <td className="py-3">
                          <span className="block text-ink">
                            {new Date(b.starts_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="block text-muted text-[11px]">
                            {new Date(b.starts_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              b.booking_status === "confirmed"
                                ? "border border-emerald-800 bg-emerald-950 text-emerald-300"
                                : b.booking_status === "pending"
                                ? "border border-amber-800 bg-amber-950 text-amber-300"
                                : "border border-red-800 bg-red-950 text-red-300"
                            }`}
                          >
                            {b.booking_status}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-ink">
                          ₹{(b.amount_paise / 100).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 max-w-[200px] truncate text-muted">
                          {b.customer_note || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
