"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users, Zap, Award, TrendingUp, Clock } from "lucide-react";

interface Stat {
  id: string;
  value: number;
  label: string;
  icon: React.ComponentType<any>;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    id: "websites-built",
    value: 150,
    label: "Websites Built",
    icon: Globe,
    suffix: "+"
  },
  {
    id: "happy-clients",
    value: 120,
    label: "Happy Clients",
    icon: Users,
    suffix: "+"
  },
  {
    id: "avg-load-time",
    value: 1.2,
    label: "Avg Load Time",
    icon: Zap,
    suffix: "s"
  },
  {
    id: "seo-score",
    value: 95,
    label: "Avg SEO Score",
    icon: TrendingUp,
    suffix: "%"
  },
  {
    id: "years-experience",
    value: 5,
    label: "Years Experience",
    icon: Award,
    suffix: "+"
  },
  {
    id: "support-time",
    value: 24,
    label: "Support Response",
    icon: Clock,
    suffix: "h"
  }
];

export function LiveStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isInView) {
      stats.forEach(stat => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 steps for smooth animation
        const increment = stat.value / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({
            ...prev,
            [stat.id]: Math.floor(current * 10) / 10 // Round to 1 decimal place
          }));
        }, stepDuration);
      });
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gradient-to-b from-dark-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Impact</span> in Numbers
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Real results, real clients, real impact. Here&apos;s what we&apos;ve achieved together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const animatedValue = animatedStats[stat.id] || 0;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card */}
                  <div className="relative bg-surface-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-105">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl mb-4 mx-auto group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {stat.prefix}{animatedValue.toFixed(stat.id === "avg-load-time" ? 1 : 0)}{stat.suffix}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
            <span className="text-primary font-medium">Live Statistics • Updated in Real-time</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
