"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircleIcon, CurrencyDollarIcon, RocketLaunchIcon, UserGroupIcon, ArrowRightIcon, XMarkIcon, ClockIcon, FireIcon } from "@heroicons/react/24/outline";

export default function SalesPartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 2,
    seconds: 51
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Exit intent popup
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitPopup && !isSubmitted) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitPopup, isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/sales-partner-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setShowExitPopup(false);
      } else {
        console.error('Registration failed:', result.error);
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated Background with Floating Money Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl text-yellow-400/30 floating-rupee">
          💰
        </div>
        <div className="absolute top-40 right-20 text-3xl text-yellow-400/30 floating-rupee" style={{ animationDelay: '1s' }}>
          💻
        </div>
        <div className="absolute bottom-40 left-20 text-3xl text-yellow-400/30 floating-rupee" style={{ animationDelay: '2s' }}>
          💸
        </div>
        <div className="absolute top-60 right-40 text-3xl text-yellow-400/30 floating-rupee" style={{ animationDelay: '3s' }}>
          🚀
        </div>
        <div className="absolute top-80 left-1/4 text-2xl text-yellow-400/20 floating-rupee" style={{ animationDelay: '4s' }}>
          💎
        </div>
        <div className="absolute bottom-60 right-1/3 text-3xl text-yellow-400/20 floating-rupee" style={{ animationDelay: '5s' }}>
          💵
        </div>
      </div>

      {/* Sticky CTA Button */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.button
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-6 py-3 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Join Now & Start Earning
        </motion.button>
      </motion.div>

      {/* Hero Section - Punch in the Face Copy */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">Earn </span>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                ₹500
              </span>
              <span className="text-white"> Per Website Sale</span>
              <br />
              <span className="text-xl sm:text-2xl lg:text-3xl text-yellow-400">
                Work From Anywhere 💻💸
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-6 max-w-3xl mx-auto font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-yellow-400 font-bold">No skills needed. No investment.</span> Students & freelancers are making <span className="text-yellow-400 font-bold">₹2000+ daily</span>. Will you be next?
            </motion.p>

            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 cta-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">Join Now & Start Earning</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Urgency & Proof Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/20 to-yellow-900/20 border-y border-yellow-500/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl text-white font-bold text-lg mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ClockIcon className="w-5 h-5 mr-2 text-yellow-400" />
              Next payout batch closes in {timeLeft.days} days {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </motion.div>

            <motion.div
              className="text-2xl sm:text-3xl font-black text-yellow-400 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              200+ students already earning with us
            </motion.div>

            {/* Social Proof Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Kunal", amount: "₹12,000", text: "I made ₹12,000 in my first month just referring shops." },
                { name: "Priya", amount: "₹8,500", text: "Started as a college student, now earning more than my parents!" },
                { name: "Rahul", amount: "₹15,000", text: "Best decision ever. Working 2 hours daily from home." }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-yellow-400 font-bold text-2xl mb-2">{testimonial.amount}</div>
                  <div className="text-white font-semibold mb-2">- {testimonial.name}</div>
                  <div className="text-gray-300 text-sm">{testimonial.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Bold Infographic */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-yellow-400 font-bold max-w-3xl mx-auto">
              Simple 3-step system to start earning with DatorQue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Refer",
                description: "Share our services with any business that needs a website",
                icon: UserGroupIcon,
                color: "from-blue-500 to-blue-700",
                bgColor: "from-blue-900/30 to-blue-800/30"
              },
              {
                step: "2",
                title: "We Close",
                description: "Our experts handle everything - sales, delivery, support",
                icon: CheckCircleIcon,
                color: "from-green-500 to-green-700",
                bgColor: "from-green-900/30 to-green-800/30"
              },
              {
                step: "3",
                title: "You Earn",
                description: "Get ₹500 instantly per confirmed website order",
                icon: CurrencyDollarIcon,
                color: "from-yellow-500 to-yellow-700",
                bgColor: "from-yellow-900/30 to-yellow-800/30"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={`bg-gradient-to-br ${item.bgColor} border-2 border-yellow-500/50 rounded-3xl p-8 h-full relative overflow-hidden`}>
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-black text-2xl">{item.step}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-300 text-center leading-relaxed">{item.description}</p>
                  
                  {/* Arrow pointing to next step */}
                  {index < 2 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRightIcon className="w-8 h-8 text-yellow-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Details Section - Make Money Pop */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              Commission Details
            </h2>
            <p className="text-xl text-yellow-400 font-bold max-w-3xl mx-auto">
              Transparent earning structure with no hidden fees
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                    <CurrencyDollarIcon className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Flat ₹500 Commission</h3>
                    <p className="text-gray-300">Per confirmed website order</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <RocketLaunchIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">No Limit</h3>
                    <p className="text-gray-300">More sales = More income</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Weekly Payouts</h3>
                    <p className="text-gray-300">Via UPI/Paytm every week</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-3xl p-8 border-2 border-yellow-500/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black text-white mb-6 text-center">Earnings Calculator</h3>
              <div className="space-y-6">
                {[
                  { orders: "2 referrals/day", amount: "₹1,000", daily: true },
                  { orders: "5 referrals/day", amount: "₹2,500", daily: true },
                  { orders: "50 referrals/month", amount: "₹25,000+", daily: false }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-2xl border border-yellow-500/30 earnings-pulse"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <span className="text-gray-300 font-semibold">{item.orders}</span>
                      {item.daily && <span className="text-yellow-400 text-sm ml-2">(Daily)</span>}
                    </div>
                    <span className="text-2xl font-black text-yellow-400 money-gradient">{item.amount}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Motivational Quote */}
              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-yellow-400 font-bold text-center italic">
                  &ldquo;Your friends waste time scrolling Instagram. You can make money from it.&rdquo;
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Objection Killer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              FAQ - Objection Killer
            </h2>
            <p className="text-xl text-yellow-400 font-bold">
              Everything you need to know about becoming a DatorQue Sales Partner
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Do I need skills?",
                answer: "No, just refer. Our team handles everything technical. You just need to share our services with businesses that need websites.",
                icon: "❌"
              },
              {
                question: "When do I get paid?",
                answer: "Weekly payouts every Friday via UPI/Paytm. No waiting, no delays. Your money hits your account every week.",
                icon: "💰"
              },
              {
                question: "What if I bring a big client?",
                answer: "Bigger commission! Enterprise clients get you higher rates. Contact us for custom arrangements on large deals.",
                icon: "🚀"
              },
              {
                question: "Can I do this from college/home?",
                answer: "Yes, it's 100% remote. Work from anywhere - your room, library, cafe. All you need is a phone and internet.",
                icon: "🏠"
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-500/60 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{faq.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-4">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section - High Conversion */}
      <section id="registration-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              Start Earning With DatorQue Today
            </h2>
            <p className="text-xl text-yellow-400 font-bold">
              Join thousands of successful DatorQue partners and start earning today
            </p>
          </motion.div>

          {!isSubmitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <label className="block text-white font-bold text-lg mb-3">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-yellow-500/30 rounded-2xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold text-lg mb-3">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-yellow-500/30 rounded-2xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold text-lg mb-3">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-yellow-500/30 rounded-2xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    placeholder="Enter your WhatsApp number"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cta-glow"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Join Now – It&apos;s Free
                        <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              className="text-center bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-500/50 rounded-3xl p-12 success-animation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">Registration Successful!</h3>
              <p className="text-xl text-gray-300 mb-6">
                Welcome to the DatorQue Sales Partner program! We&apos;ll contact you within 24 hours with your partner credentials and getting started guide.
              </p>
              <div className="text-xl text-green-400 font-bold">
                Get ready to start earning! 🚀
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Final CTA Section - Punch Hard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
              Don&apos;t just watch others earn. Take control. Start earning{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                ₹2000+ daily
              </span>{" "}
              today.
            </h2>

            <motion.button
              className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-2xl rounded-3xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 cta-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 flex items-center">
                Join The Movement 🚀
                <RocketLaunchIcon className="w-8 h-8 ml-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500 rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 text-white hover:text-red-300 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <FireIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-4">
                Wait! Don&apos;t leave your ₹2000/day behind.
              </h3>
              <p className="text-gray-300 mb-6">
                Register free now and start earning with DatorQue today!
              </p>
              
              <motion.button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg py-3 rounded-2xl hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowExitPopup(false);
                  document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Register Free Now
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
