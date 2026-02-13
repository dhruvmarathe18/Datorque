"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="stat-number">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { label: "Institutes", value: 500, suffix: "+" },
  { label: "Students Managed", value: 50000, suffix: "+" },
  { label: "Uptime", value: 99.9, suffix: "%" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1E1B4B]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-indigo-600/30 top-[-200px] left-[-200px] animate-float-slow" />
      <div className="gradient-orb w-[500px] h-[500px] bg-indigo-400/20 bottom-[-100px] right-[-100px] animate-float-delayed" />
      <div className="gradient-orb w-[300px] h-[300px] bg-indigo-500/20 top-[30%] right-[10%] animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-indigo-200">Now available on Google Play</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              The Operating System for{" "}
              <span className="gradient-text-light">Coaching Institutes</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg sm:text-xl text-indigo-200/70 max-w-xl mb-10 leading-relaxed"
            >
              Manage students, staff, attendance, fees, homework, tests, and communication — all from one beautiful app.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link href="/download" className="btn-glow inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.698-2.302 2.698-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" /></svg>
                Download on Play Store
              </Link>
              <a href="/login" className="btn-ghost inline-flex items-center gap-2">
                Try Web Portal
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </a>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-8 sm:gap-12"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-indigo-300/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full scale-150" />

              {/* Phone frame */}
              <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[44px] border-4 border-gray-700 shadow-2xl shadow-indigo-900/50 animate-float-slow overflow-hidden">
                {/* Screen notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
                {/* Screen content */}
                <div className="w-full h-full bg-gradient-to-b from-[#1E1B4B] to-[#312E81] p-4 pt-10 rounded-[40px]">
                  {/* Status bar */}
                  <div className="flex justify-between items-center px-2 mb-6">
                    <span className="text-[10px] text-white/60 font-mono">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-white/40 rounded-sm">
                        <div className="w-3/4 h-full bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  {/* Dashboard header */}
                  <div className="mb-6">
                    <p className="text-[10px] text-indigo-300/60">Welcome back 👋</p>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Poppins' }}>Admin Dashboard</p>
                  </div>
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: "Students", val: "1,247", color: "from-indigo-500/20 to-indigo-600/10", icon: "👨‍🎓" },
                      { label: "Present", val: "94%", color: "from-emerald-500/20 to-emerald-600/10", icon: "✅" },
                      { label: "Fees Collected", val: "₹4.2L", color: "from-amber-500/20 to-amber-600/10", icon: "💰" },
                      { label: "Pending", val: "12", color: "from-rose-500/20 to-rose-600/10", icon: "📋" },
                    ].map((s) => (
                      <div key={s.label} className={`bg-gradient-to-br ${s.color} border border-white/5 rounded-xl p-3`}>
                        <span className="text-lg">{s.icon}</span>
                        <p className="text-xs text-indigo-200/60 mt-1">{s.label}</p>
                        <p className="text-sm font-bold text-white font-mono">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {/* Activity list */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-indigo-300/60 font-semibold uppercase tracking-wider">Recent Activity</p>
                    {[
                      { text: "Attendance marked — Batch A", time: "2m ago" },
                      { text: "Fee payment received", time: "15m ago" },
                      { text: "New homework assigned", time: "1h ago" },
                    ].map((item) => (
                      <div key={item.text} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-[10px] text-indigo-100/80">{item.text}</span>
                        <span className="text-[8px] text-indigo-300/40">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-16 top-20 glass-card px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-lg">✓</span>
                  <div>
                    <p className="text-[10px] font-semibold text-white">Attendance</p>
                    <p className="text-[9px] text-indigo-300/60">Marked in 10 sec</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -right-16 bottom-32 glass-card px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg">₹</span>
                  <div>
                    <p className="text-[10px] font-semibold text-white">Fee Received</p>
                    <p className="text-[9px] text-indigo-300/60">₹15,000 — UPI</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
