"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "NIYANTRA completely transformed how we manage our coaching center. Attendance, fees, homework — everything is streamlined now. We save 3+ hours every single day.",
    name: "Rajesh Sharma",
    role: "Director, Sharma Classes",
    city: "Pune",
    rating: 5,
  },
  {
    quote: "The best part is the real-time chat and push notifications. Parents love getting instant updates about their child's attendance and performance. Our retention rate increased by 40%.",
    name: "Priya Deshmukh",
    role: "Founder, BrightMinds Academy",
    city: "Nashik",
    rating: 5,
  },
  {
    quote: "We moved from Excel sheets to NIYANTRA and it was like going from a bicycle to a sports car. The fee management alone has saved us ₹2L in missed payments.",
    name: "Amit Patel",
    role: "Owner, Patel Coaching Center",
    city: "Ahmedabad",
    rating: 5,
  },
  {
    quote: "As a teacher, I love how easy it is to assign homework and check submissions. The OCR scanner is a game-changer for creating question papers quickly.",
    name: "Sneha Kulkarni",
    role: "Senior Faculty, Vidya Classes",
    city: "Bangalore",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-[#1E1B4B] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="gradient-orb w-[500px] h-[500px] bg-indigo-500/10 -top-40 -right-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Loved by{" "}
            <span className="gradient-text-light">200+ coaching institutes</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-indigo-200/80 text-sm font-mono font-semibold">4.9/5 average</span>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:bg-white/[0.07] transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-indigo-100/80 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-indigo-300/50">{t.role} — {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
