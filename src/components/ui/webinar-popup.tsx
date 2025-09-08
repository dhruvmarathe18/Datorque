'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Zap, Users, CheckCircle } from 'lucide-react';

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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 max-w-2xl w-full relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
                >
                  <Zap className="w-4 h-4" />
                  FREE STUDENT WEBINAR
                </motion.div>
                
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Turn Your Skills Into a{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Career in Tech!
                  </span>
                </motion.h1>
                
                <motion.p
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Learn how students can build real projects & land internships in 2025
                </motion.p>
              </div>

              {/* Countdown Timer */}
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center mb-4">
                  <p className="text-blue-100 text-sm font-semibold">Webinar Starts In:</p>
                </div>
                <div className="flex justify-center gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-xs text-blue-100 capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  '🚀 Build Startup-Style Websites',
                  '🎓 Real-World Internship Insights',
                  '💼 Earn Through Tech Skills',
                  '🏆 Free Participation Certificate'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">5000+ students already registered</span>
                </div>
                <p className="text-gray-400 text-sm">Join the community of successful students!</p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Reserve My Free Seat
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Maybe Later
                </motion.button>
              </motion.div>

              {/* Urgency */}
              <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-yellow-400 text-sm font-semibold">
                  ⚡ Limited seats available - Don&apos;t miss out!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
