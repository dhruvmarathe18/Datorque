import type { Metadata } from "next";
import { Smartphone, Monitor, QrCode } from "lucide-react";
import { CTABanner } from "@/components/niyantra/cta-banner";

export const metadata: Metadata = {
  title: "Download NIYANTRA — Android App & Web Portal",
  description: "Download NIYANTRA on Google Play or access the web portal. Available for coaching institutes across India.",
};

export default function DownloadPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            Download
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Get NIYANTRA today
          </h1>
          <p className="text-lg text-indigo-200/60 max-w-2xl mx-auto">
            Available on Google Play for Android. Web portal for desktop access. iOS coming soon.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Android */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>Android App</h2>
              <p className="text-gray-500 text-sm mb-6">
                Download from Google Play Store. Requires Android 7.0+ and ~25 MB of storage.
              </p>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors mb-6"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 13l2.302-2.493zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                </svg>
                Get it on Google Play
              </a>

              {/* QR Code placeholder */}
              <div className="mx-auto w-32 h-32 bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Scan to download</p>
            </div>

            {/* Web Portal */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>Web Portal</h2>
              <p className="text-gray-500 text-sm mb-6">
                Access your institute dashboard from any browser. Best for admin tasks and report generation.
              </p>
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors mb-6"
              >
                <Monitor className="w-4 h-4" />
                Open Web Portal
              </a>
              <p className="text-xs text-gray-400">Works on Chrome, Firefox, Safari, and Edge</p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 text-center">
            <span className="text-4xl mb-4 block">🍎</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>iOS — Coming Soon</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We&apos;re working on the iOS version of NIYANTRA. Join the waitlist to be notified when it launches.
            </p>
          </div>

          {/* System Requirements */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: 'Poppins' }}>System Requirements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Android App</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>Android 7.0 (Nougat) or higher</li>
                  <li>~25 MB storage space</li>
                  <li>Internet connection required</li>
                  <li>Camera for OCR (optional)</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Web Portal</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>Any modern browser</li>
                  <li>1024px+ screen recommended</li>
                  <li>Internet connection required</li>
                  <li>No installation needed</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">iOS App (Coming Soon)</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>iOS 15.0 or higher</li>
                  <li>iPhone & iPad supported</li>
                  <li>~30 MB storage space</li>
                  <li>ETA: Q3 2025</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
