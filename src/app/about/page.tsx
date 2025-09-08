"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Target, Zap, Shield, Globe, Star, Trophy, Medal, CheckCircle } from "lucide-react";
import { Testimonials } from "@/components/sections/testimonials";

const awards = [
  {
    title: "Best Web Development Agency 2024",
    organization: "Digital India Awards",
    year: "2024",
    icon: Trophy,
    description: "Recognized for excellence in web development and digital innovation"
  },
  {
    title: "Top 10 Web Design Company",
    organization: "Clutch.co",
    year: "2024",
    icon: Medal,
    description: "Ranked among India's top web design companies by client reviews"
  },
  {
    title: "Excellence in E-commerce Solutions",
    organization: "India E-commerce Awards",
    year: "2023",
    icon: Award,
    description: "Awarded for outstanding e-commerce platform development"
  },
  {
    title: "SEO Performance Leader",
    organization: "Search Engine Land",
    year: "2023",
    icon: Star,
    description: "Recognized for exceptional SEO results and organic growth strategies"
  }
];

const stats = [
  { number: "500+", label: "Projects Completed", icon: Target },
  { number: "98%", label: "Client Satisfaction", icon: CheckCircle },
  { number: "50+", label: "Team Members", icon: Users },
  { number: "5+", label: "Years Experience", icon: Globe }
];

const values = [
  {
    title: "Innovation First",
    description: "We stay ahead of the curve with cutting-edge technologies and creative solutions that set your business apart.",
    icon: Zap
  },
  {
    title: "Quality Assurance",
    description: "Every project undergoes rigorous testing and quality checks to ensure flawless performance and user experience.",
    icon: Shield
  },
  {
    title: "Client-Centric Approach",
    description: "Your success is our success. We work closely with you to understand your goals and deliver beyond expectations.",
    icon: Target
  }
];

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            About <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">DatorQue</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            We&apos;re a team of passionate developers and designers creating exceptional digital experiences for Indian businesses. Based in Bangalore, we&apos;ve been fueling digital momentum since 2019.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section ref={ref} className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Awards & <span className="text-gradient">Recognition</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders and clients worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-surface/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <award.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{award.title}</h3>
                      <span className="text-sm text-primary font-medium">{award.year}</span>
                    </div>
                    <p className="text-primary text-sm font-medium mb-2">{award.organization}</p>
                    <p className="text-gray-300">{award.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do and drive our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To empower Indian businesses with world-class digital solutions that drive growth, 
              enhance user experience, and create lasting value. We believe every business deserves 
              a digital presence that reflects their ambition and potential.
            </p>
            <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
              <p className="text-lg text-white font-medium">
                "Fueling your digital momentum through innovative web solutions, 
                exceptional design, and unwavering commitment to your success."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}

