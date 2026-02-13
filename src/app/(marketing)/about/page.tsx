import type { Metadata } from "next";
import { CTABanner } from "@/components/niyantra/cta-banner";

export const metadata: Metadata = {
  title: "About — NIYANTRA | Built by Datorque",
  description: "Learn how Datorque is building NIYANTRA — the smartest coaching institute management platform, made with love in India.",
};

const timeline = [
  { year: "2024", title: "Idea Born", desc: "Identified the pain points of Indian coaching institutes — paper registers, WhatsApp chaos, no structure." },
  { year: "2024", title: "Research & Design", desc: "Interviewed 50+ coaching institute owners across Maharashtra. Designed role-based dashboards for Admin, Teacher, and Student." },
  { year: "2025", title: "NIYANTRA v1.0", desc: "Launched on Google Play with 12 core modules: attendance, fees, homework, tests, chat, notices, materials, reports, OCR scanner & more." },
  { year: "2025", title: "Growing Fast", desc: "500+ institutes onboarded. 50,000+ students & teachers using NIYANTRA daily." },
];

const values = [
  { emoji: "🇮🇳", title: "Made in India, for India", desc: "Built from the ground up for the unique needs of India's coaching ecosystem — multi-language, UPI-first, low-bandwidth friendly." },
  { emoji: "🔒", title: "Privacy First", desc: "Row-level security ensures complete data isolation between institutes. OCR processing is 100% on-device. We never sell data." },
  { emoji: "⚡", title: "Speed Obsessed", desc: "Mark attendance for 60 students in under 10 seconds. Every interaction is designed to save time for busy educators." },
  { emoji: "🎯", title: "Simple by Design", desc: "Technology should reduce complexity, not add to it. Teachers and admins shouldn't need training to use their management app." },
  { emoji: "💪", title: "Built to Scale", desc: "From a 10-student tuition class to a 5,000-student coaching chain — same app, same simplicity, enterprise-grade infrastructure." },
  { emoji: "❤️", title: "Educator Empathy", desc: "Our team includes former tutors and coaching staff. We build what we wish we'd had." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Building the future of coaching management
          </h1>
          <p className="text-lg text-indigo-200/60 max-w-2xl mx-auto">
            NIYANTRA is built by <strong className="text-indigo-300">Datorque</strong> — a young, passionate product studio from India.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">Our Mission</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                Digitize every coaching institute in India
              </h3>
              <p className="text-gray-500 leading-relaxed">
                India has over <strong>3 lakh coaching institutes</strong> — most still run on paper registers, WhatsApp groups, and Excel sheets. 
                We&apos;re building NIYANTRA to give every coaching centre — from a 10-student tuition class to a 5,000-student academy — the same 
                powerful tools that big EdTech companies have, but at a price every educator can afford.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">Our Vision</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                Smart coaching, simplified
              </h3>
              <p className="text-gray-500 leading-relaxed">
                We envision a world where teachers focus on teaching, not admin work. Where parents are always in the loop. 
                Where institute owners have real-time visibility into every aspect of their business — all from a single, 
                beautiful mobile app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
              What we believe in
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{v.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16" style={{ fontFamily: 'Poppins' }}>
            Our journey so far
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 to-purple-500" />
            <div className="space-y-12">
              {timeline.map((item) => (
                <div key={item.title} className="relative flex gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center shrink-0 z-10">
                    <span className="text-sm font-bold text-indigo-600" style={{ fontFamily: 'JetBrains Mono' }}>{item.year}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Built by Datorque
          </h2>
          <p className="text-indigo-200/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            We&apos;re a small, focused product team based in India. Datorque builds technology products that 
            solve real problems — starting with education.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-indigo-300">🌐</span>
            <span className="text-indigo-200 text-sm font-medium">datorque.com</span>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
