'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Zap, Users, Sparkles, GraduationCap, Briefcase, Trophy } from 'lucide-react';

interface WebinarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebinarPopup({ isOpen, onClose }: WebinarPopupProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set webinar time (next Saturday at 6 PM)
    const webinarDate = new Date();
    const nextSaturday = new Date(webinarDate);
    nextSaturday.setDate(webinarDate.getDate() + (6 - webinarDate.getDay()));
    nextSaturday.setHours(18, 0, 0, 0);
    
    // If it's already past this Saturday, set to next Saturday
    if (webinarDate > nextSaturday) {
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextSaturday.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    // Scroll to webinar page or redirect
    window.location.href = '/webinar';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full relative overflow-hidden shadow-2xl"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-2xl hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-white text-black px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold mb-4 shadow-lg"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  FREE STUDENT WEBINAR
                </motion.div>
                
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-3 sm:mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Turn Your Skills Into a{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent font-semibold">
                    Career in Tech!
                  </span>
                </motion.h1>
                
                <motion.p
                  className="text-gray-400 text-sm sm:text-base leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Learn how students can build real projects & land internships in 2025
                </motion.p>
              </div>

              {/* Countdown Timer */}
              <motion.div
                className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium tracking-wide">Webinar Starts In:</p>
                </div>
                <div className="flex justify-center gap-3 sm:gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <motion.div 
                      key={unit} 
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-1 tracking-tight">
                        {value.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">{unit}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: Rocket, text: 'Build Startup-Style Websites' },
                  { icon: GraduationCap, text: 'Real-World Internship Insights' },
                  { icon: Briefcase, text: 'Earn Through Tech Skills' },
                  { icon: Trophy, text: 'Free Participation Certificate' }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 text-gray-300 p-3 rounded-2xl hover:bg-white/5 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="text-center mb-6 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                  <div className="w-6 h-6 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">5000+ students already registered</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Join the community of successful students!</p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-white text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Rocket className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Reserve My Free Seat</span>
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-200 text-sm sm:text-base font-medium"
                >
                  Maybe Later
                </motion.button>
              </motion.div>

              {/* Urgency */}
              <motion.div
                className="text-center mt-4 sm:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-2xl">
                  <Sparkles className="w-3 h-3" />
                  <p className="text-xs sm:text-sm font-semibold">
                    Limited seats available - Don&apos;t miss out!
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
