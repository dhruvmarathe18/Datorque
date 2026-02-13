import type { Metadata } from "next";

import { CTABanner } from "@/components/niyantra/cta-banner";

export const metadata: Metadata = {
  title: "Features — NIYANTRA | All-in-One Coaching Institute Management",
  description: "Explore 12 powerful modules: Student Management, Attendance, Fees, Homework, Tests, Chat, Notices, Reports, OCR Scanner & more.",
};

const featureDetails = [
  {
    title: "Student Management",
    desc: "Maintain complete student profiles including personal details, parent/guardian information, batch assignments, fee plans, and academic history. Bulk import students via CSV. Instantly search and filter by name, batch, or status.",
    bullets: ["Complete profiles with parent info", "Batch & subject assignments", "Bulk CSV upload", "Search & filter students", "Academic history tracking"],
    icon: "👨‍🎓",
  },
  {
    title: "Attendance Tracking",
    desc: "Mark attendance for an entire batch in under 10 seconds. View daily, weekly, and monthly analytics with beautiful charts. Export attendance reports as PDF or CSV. Automatic push notification to parents for absent students.",
    bullets: ["One-tap batch attendance", "Daily/weekly/monthly analytics", "PDF & CSV export", "Auto-notification for absences", "Late marking support"],
    icon: "✅",
  },
  {
    title: "Fee Management",
    desc: "Track fee schedules for monthly, quarterly, yearly, or one-time payments. Record payments manually (cash, UPI, card, bank transfer, cheque). Generate beautiful receipts. Send automatic reminders for pending fees.",
    bullets: ["Flexible fee structures", "Multiple payment methods", "Receipt generation", "Automatic reminders", "Payment history tracking"],
    icon: "💰",
  },
  {
    title: "Homework System",
    desc: "Create and assign homework with file attachments. Students submit work with text and file uploads. Teachers review, grade, and provide feedback. Track submission status across batches.",
    bullets: ["File attachment support", "Student submissions", "Teacher feedback & grading", "Deadline tracking", "Batch-wise assignments"],
    icon: "📝",
  },
  {
    title: "Test & Results",
    desc: "Create tests and exams, record marks, and generate performance analytics. View individual student progress over time. Calculate grades and percentages automatically. Share results with students and parents.",
    bullets: ["Test creation & scheduling", "Marks entry & grading", "Performance analytics", "Progress tracking over time", "Result sharing"],
    icon: "📊",
  },
  {
    title: "Real-time Chat",
    desc: "Instant messaging between admin, staff, and students with support for text, images, PDFs, and documents. Organized by batches and roles. Never miss an important message with push notification support.",
    bullets: ["Text & file messaging", "Image, PDF & doc sharing", "Batch-wise channels", "Push notification alerts", "Message history"],
    icon: "💬",
  },
  {
    title: "Notice Board",
    desc: "Broadcast announcements to the entire institute or specific batches. Set priority levels (normal, important, urgent). Track which users have viewed each notice. Attach files and images.",
    bullets: ["Institute-wide or batch-specific", "Priority levels", "Read tracking", "File attachments", "Push notification delivery"],
    icon: "📢",
  },
  {
    title: "Study Materials",
    desc: "Share notes, videos, documents, and resources organized by subject and batch. Students access materials directly from the app. Track which materials have been viewed.",
    bullets: ["Organized by subject & batch", "Multiple file formats", "In-app access", "View tracking", "Easy upload interface"],
    icon: "📚",
  },
  {
    title: "Smart Reports",
    desc: "Generate comprehensive reports for attendance, fee collection, and academic performance. Export as PDF or CSV. Beautiful visualizations with charts and graphs. Filter by date range, batch, or student.",
    bullets: ["Attendance reports", "Fee collection reports", "Academic performance", "PDF & CSV export", "Custom date filters"],
    icon: "📈",
  },
  {
    title: "Push Notifications",
    desc: "Keep everyone in the loop with instant push notifications for attendance updates, homework assignments, fee reminders, notices, and chat messages. Customizable notification preferences.",
    bullets: ["Attendance alerts", "Homework reminders", "Fee due notifications", "Notice alerts", "Chat message notifications"],
    icon: "🔔",
  },
  {
    title: "OCR Question Scanner",
    desc: "Students can scan printed or handwritten questions using their camera and get instant text recognition. All processing happens ON-DEVICE using Google ML Kit — no data is sent to any server. Privacy-first by design.",
    bullets: ["Camera-based scanning", "Printed & handwritten text", "100% on-device processing", "No cloud upload", "Instant text extraction"],
    icon: "📷",
  },
  {
    title: "Multi-Role Access",
    desc: "Three separate dashboards tailored for admins, teachers, and students. Row-level security ensures complete data isolation between institutes. Each role sees only what they need.",
    bullets: ["Admin dashboard", "Teacher panel", "Student portal", "Secure data isolation", "Role-based permissions"],
    icon: "🔒",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            Features
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Everything your coaching institute needs
          </h1>
          <p className="text-lg text-indigo-200/60 max-w-2xl mx-auto">
            12 powerful modules designed from the ground up for India&apos;s coaching ecosystem.
          </p>
        </div>
      </section>

      {/* Feature Deep-dives */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {featureDetails.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Visual */}
                <div className="lg:w-1/2">
                  <div className="relative bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100">
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">{feature.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{feature.title}</h3>
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        {feature.bullets.slice(0, 4).map((b) => (
                          <div key={b} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-xs text-gray-600 text-left">
                            ✓ {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="lg:w-1/2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6">{feature.desc}</p>
                  <ul className="space-y-2">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
