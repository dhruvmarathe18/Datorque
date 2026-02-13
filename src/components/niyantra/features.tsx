"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Users, ClipboardCheck, CreditCard, BookOpen, FileText, MessageSquare,
  Bell, FolderOpen, BarChart3, BellRing, ScanLine, Shield
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Complete student profiles with parent info, batch assignments, and academic history.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    description: "Mark attendance in seconds, get instant analytics, export reports.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description: "Track payments, generate receipts, send reminders automatically.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: BookOpen,
    title: "Homework System",
    description: "Assign, submit, review with file attachments and feedback.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: FileText,
    title: "Test & Results",
    description: "Create tests, record marks, generate performance analytics.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Instant messaging between admin, staff, and students with file sharing.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Bell,
    title: "Notice Board",
    description: "Broadcast announcements with read tracking and priority levels.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: FolderOpen,
    title: "Study Materials",
    description: "Share notes, videos, documents organized by subject and batch.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "Smart Reports",
    description: "Attendance, fee collection, academic performance — all exportable as PDF/CSV.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: BellRing,
    title: "Push Notifications",
    description: "Instant alerts for attendance, homework, fees, and notices.",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: ScanLine,
    title: "OCR Question Scanner",
    description: "Students scan questions with camera, get instant solutions — all on-device.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Shield,
    title: "Multi-Role Access",
    description: "Separate dashboards for admin, staff, and students with secure isolation.",
    color: "from-slate-500 to-slate-600",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-white relative" id="features">
      <div className="absolute inset-0 dot-pattern-light" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
            Everything you need to run a{" "}
            <span className="gradient-text">modern coaching institute</span>
          </h2>
          <p className="text-lg text-gray-500">
            12 powerful modules designed specifically for India&apos;s coaching ecosystem. No setup headaches, no hidden costs.
          </p>
        </motion.div>

        {/* Features grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
