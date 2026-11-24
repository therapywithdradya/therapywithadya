import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export function DemoFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl text-white tracking-tight mb-2">
              Therapy with Dr. Adya Vats
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              A safe, compassionate, and trauma-informed space to acknowledge what you’re carrying, understand yourself more deeply, and take meaningful steps forward.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Online Sessions (Worldwide) &amp; In-Person by Appointment</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore Demo Pages
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/tempPages/design-1" className="hover:text-white transition">Home Overview</Link>
              </li>
              <li>
                <Link href="/tempPages/design-1#services" className="hover:text-white transition">Services &amp; Programs</Link>
              </li>
              <li>
                <Link href="/tempPages/design-1/book" className="hover:text-white transition">Book a Slot (Demo)</Link>
              </li>
              <li>
                <Link href="/tempPages/design-1/contact" className="hover:text-white transition">Contact Page (Demo)</Link>
              </li>
              <li>
                <Link href="/tempPages/design-1#reviews" className="hover:text-white transition">Client Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:adyavats13@gmail.com" className="hover:text-white">adyavats13@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <a
                  href="https://www.instagram.com/dr.adya_vats"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  @dr.adya_vats
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/tempPages/design-1/book"
                  className="inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                >
                  Book a session
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety & Emergency Notice */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 mb-8 leading-relaxed">
          <strong className="text-slate-200">Emergency and crisis support:</strong> This practice does not provide emergency crisis services. If you or someone you know is in immediate danger, please reach out to national emergency services at <strong className="text-slate-200">112</strong> or Tele-MANAS at <strong className="text-slate-200">14416</strong>.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs text-slate-500">
          <div>&copy; {new Date().getFullYear()} Therapy with Dr. Adya Vats. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms-and-cancellation" className="hover:text-slate-400">Terms &amp; Cancellation</Link>
            <Link href="/tempPages" className="text-purple-400 hover:text-purple-300">Design Review Hub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
