"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Set Up Your Institute",
    description: "Register your coaching center, add batches, configure fee structures and academic calendar. Takes less than 10 minutes.",
    icon: "🏫",
  },
  {
    number: "02",
    title: "Add Your Team",
    description: "Invite staff and enroll students with bulk upload support. Assign roles, batches, and subjects instantly.",
    icon: "👥",
  },
  {
    number: "03",
    title: "Start Managing",
    description: "Attendance, fees, homework, communication — everything is automated. Focus on teaching, not paperwork.",
    icon: "🚀",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-[#1E1B4B] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      {/* Gradient orbs */}
      <div className="gradient-orb w-[400px] h-[400px] bg-indigo-500/20 -top-32 -left-32" />
      <div className="gradient-orb w-[300px] h-[300px] bg-indigo-600/20 -bottom-24 -right-24" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Up and running in{" "}
            <span className="gradient-text-light">three simple steps</span>
          </h2>
          <p className="text-lg text-indigo-200/60">
            No complex setup. No training required. Just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative text-center"
            >
              {/* Step circle */}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                <span className="text-3xl">{step.icon}</span>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white font-mono">{step.number}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Poppins' }}>
                {step.title}
              </h3>
              <p className="text-sm text-indigo-200/60 max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
