"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LayoutDashboard, GraduationCap, UserCheck } from "lucide-react";

const roles = [
  {
    id: "admin",
    label: "Coaching Admin",
    icon: LayoutDashboard,
    features: [
      "Real-time institute health score dashboard",
      "Student enrollment & batch management",
      "Fee collection tracking with receipt generation",
      "Staff performance monitoring",
      "Exportable reports (PDF, CSV)",
      "Notice broadcasting with read tracking",
    ],
    screenTitle: "Admin Dashboard",
    stats: [
      { label: "Total Students", value: "1,247" },
      { label: "Fee Collected", value: "₹18.5L" },
      { label: "Attendance Today", value: "94%" },
      { label: "Pending Homework", value: "23" },
    ],
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: UserCheck,
    features: [
      "One-tap attendance marking per batch",
      "Homework creation with file attachments",
      "Test management and result entry",
      "Batch-wise communication channels",
      "Study material distribution",
      "Student performance analytics",
    ],
    screenTitle: "Teacher Panel",
    stats: [
      { label: "My Batches", value: "5" },
      { label: "Homework Active", value: "8" },
      { label: "Tests This Week", value: "3" },
      { label: "Messages", value: "42" },
    ],
  },
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    features: [
      "View attendance history & statistics",
      "Submit homework with file uploads",
      "Check test results and grades",
      "Access study materials by subject",
      "Chat with teachers and admins",
      "Receive instant push notifications",
    ],
    screenTitle: "Student Portal",
    stats: [
      { label: "Attendance", value: "92%" },
      { label: "Avg Score", value: "87%" },
      { label: "Homework Due", value: "2" },
      { label: "Study Materials", value: "34" },
    ],
  },
];

export function RoleShowcase() {
  const [activeRole, setActiveRole] = useState("admin");
  const role = roles.find((r) => r.id === activeRole)!;

  return (
    <section className="section-padding bg-indigo-50/50 relative overflow-hidden" id="roles">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold mb-4">
            Built for Every Role
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
            One app, <span className="gradient-text">three powerful dashboards</span>
          </h2>
          <p className="text-lg text-gray-500">
            Tailored experiences for admins, teachers, and students.
          </p>
        </motion.div>

        {/* Role tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeRole === r.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <r.icon className="w-4 h-4" />
              {r.label}
            </button>
          ))}
        </div>

        {/* Role content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative w-[260px] h-[540px] bg-gray-900 rounded-[40px] border-4 border-gray-700 shadow-2xl shadow-indigo-900/20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-2xl z-10" />
                <div className="w-full h-full bg-gradient-to-b from-[#1E1B4B] to-[#312E81] p-4 pt-8 rounded-[36px]">
                  <div className="flex justify-between items-center px-1 mb-4">
                    <span className="text-[9px] text-white/50 font-mono">9:41</span>
                    <span className="text-[9px] text-white/50">●●●</span>
                  </div>
                  <p className="text-xs font-semibold text-white mb-4" style={{ fontFamily: 'Poppins' }}>{role.screenTitle}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {role.stats.map((s) => (
                      <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                        <p className="text-[8px] text-indigo-300/50">{s.label}</p>
                        <p className="text-xs font-bold text-white font-mono">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {role.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-[9px] text-indigo-200/70 truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                {role.label} Dashboard
              </h3>
              <p className="text-gray-500 mb-8">
                Purpose-built tools for {role.id === "admin" ? "institute management" : role.id === "teacher" ? "teaching & assessment" : "learning & growth"}.
              </p>
              <div className="space-y-4">
                {role.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center mt-0.5 shrink-0">
                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
