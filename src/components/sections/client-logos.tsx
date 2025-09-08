"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const clients = [
  { name: "TechCorp", logo: "TC" },
  { name: "StartupHub", logo: "SH" },
  { name: "DigitalFlow", logo: "DF" },
  { name: "InnovateLab", logo: "IL" },
  { name: "WebCraft", logo: "WC" },
  { name: "PixelPerfect", logo: "PP" },
  { name: "CodeMasters", logo: "CM" },
  { name: "DesignStudio", logo: "DS" },
  { name: "AppBuilder", logo: "AB" },
  { name: "CloudTech", logo: "CT" },
  { name: "DataDriven", logo: "DD" },
  { name: "FutureWeb", logo: "FW" }
];

export function ClientLogos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-dark-800 to-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Amazing Companies</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join hundreds of successful businesses who chose DatorQue for their digital transformation
          </p>
        </motion.div>

        {/* Scrolling Logos */}
        <div className="relative">
          <div className="flex animate-scroll">
            {[...clients, ...clients].map((client, index) => (
              <motion.div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 mx-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-24 h-24 bg-surface-900/50 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center group hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                  <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {client.logo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
