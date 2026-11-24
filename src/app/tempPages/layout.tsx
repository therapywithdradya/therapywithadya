import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Designs Review | Dr. Adya Vats",
  description: "Temporary preview pages and alternative frontend designs for client review.",
};

export default function TempPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="temp-pages-root" className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-purple-200 selection:text-purple-900">
      {children}
    </div>
  );
}
