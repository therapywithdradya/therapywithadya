import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function TempPagesIndex() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Client Design Review Hub
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Frontend Design Concepts
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            This temporary hub contains alternative frontend design concepts for Dr. Adya Vats practice.
            You can review live demos below and share feedback.
          </p>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-purple-300 hover:shadow-md transition bg-gradient-to-br from-white to-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100/60 px-2.5 py-0.5 rounded-full">
                    Sample Design 1
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    Mindhouse-Inspired Wellness Platform
                  </h2>
                </div>
                <Link
                  href="/tempPages/design-1"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition shadow-sm w-fit"
                >
                  View Live Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-slate-600 mb-6">
                A clean, modern mental health and mindfulness aesthetic featuring deep satin indigo gradients,
                royal purple transformation visuals, interactive mindfulness audio player, carousel for concerns,
                and a warm linen review section.
              </p>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                <Link
                  href="/tempPages/design-1"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
                >
                  <span>Main Home Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tempPages/design-1/book"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <span>Book a Slot Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tempPages/design-1/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  <span>Contact Page Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400">
              <p className="text-sm font-medium">Additional sample designs will appear here as you share them.</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition flex items-center gap-1">
              ← Return to existing live website
            </Link>
            <span>Therapy with Dr. Adya Vats</span>
          </div>
        </div>
      </div>
    </div>
  );
}
