"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="gradient-orb w-[500px] h-[500px] bg-indigo-400/20 top-[-200px] left-1/2 -translate-x-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Ready to Transform Your{" "}
            <span className="gradient-text-light">Coaching Institute?</span>
          </h2>
          <p className="text-lg text-indigo-200/60 mb-10 max-w-2xl mx-auto">
            Join 500+ coaching institutes already using NIYANTRA to save time, increase efficiency, and focus on what matters most — teaching.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/download" className="btn-glow inline-flex items-center gap-2 text-lg px-8 py-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.698-2.302 2.698-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" /></svg>
              Download NIYANTRA
            </Link>
            <a
              href="https://wa.me/918956501983?text=Hi%2C%20I'm%20interested%20in%20NIYANTRA%20for%20my%20coaching%20institute."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
