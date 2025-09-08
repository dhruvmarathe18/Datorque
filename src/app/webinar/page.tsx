'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Clock, 
  Users, 
  CheckCircle, 
  X,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Phone,
  Mail,
  User,
  Building2
} from 'lucide-react';

// Tech stack logos data
const techStackLogos = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Tailwind', icon: '🎨' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'AWS', icon: '☁️' }
];

// Student testimonials
const testimonials = [
  { name: 'Priya', city: 'Mumbai', year: '3rd Year CS', quote: 'I landed my first freelance project after attending!' },
  { name: 'Arjun', city: 'Bangalore', year: '2nd Year IT', quote: 'The webinar changed my perspective on tech careers!' },
  { name: 'Sneha', city: 'Delhi', year: '4th Year CSE', quote: 'Got my internship at a startup within a month!' },
  { name: 'Rahul', city: 'Pune', year: '3rd Year CS', quote: 'Learned how to build real-world applications!' }
];

// Benefits data
const benefits = [
  {
    icon: Rocket,
    title: 'Build Startup-Style Websites',
    description: 'Learn to create websites like Zomato/Swiggy that actually get users'
  },
  {
    icon: GraduationCap,
    title: 'Real-World Internship Insights',
    description: 'Get insider tips on landing internships at top tech companies'
  },
  {
    icon: Briefcase,
    title: 'Earn Through Tech',
    description: 'Discover how students are making money with their coding skills'
  },
  {
    icon: Trophy,
    title: 'Free Participation Certificate',
    description: 'Get a certificate to boost your LinkedIn profile and resume'
  }
];

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set webinar date (next Saturday at 6 PM)
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
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-8 justify-center items-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-3xl md:text-4xl font-light text-white mb-2 tracking-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {value.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest">{unit}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Live Registration Popup Component
const LiveRegistrationPopup = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-6 right-6 backdrop-blur-xl bg-white/10 border border-white/20 text-white p-6 rounded-3xl shadow-2xl z-50 max-w-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-sm font-medium tracking-wide" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          Live Registration
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        <span className="font-semibold text-white">{testimonials[currentTestimonial].name}</span> from{' '}
        <span className="font-semibold text-white">{testimonials[currentTestimonial].city}</span> just registered!
      </p>
    </motion.div>
  );
};

// Multi-step Form Component
const WebinarForm = ({ onSeatUpdate }: { onSeatUpdate: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Proceed with form submission
    
    try {
      const response = await fetch('/api/webinar-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Update the seat count
        onSeatUpdate();
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-gray-300 mb-4">
          Check your email for webinar details and the FREE AI MODEL guide!
        </p>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-cyan-500 to-white text-black px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
        >
          Join WhatsApp Group
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="flex gap-2">
            {[1, 2].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-cyan-500 to-white text-black shadow-lg'
                    : 'bg-white/10 text-gray-400 border border-white/20'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 md:h-2">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-white h-1.5 md:h-2 rounded-full shadow-lg"
            initial={{ width: '0%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>



       <AnimatePresence mode="wait">
         {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2 md:mb-3 tracking-wide">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2 md:mb-3 tracking-wide">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2 md:mb-3 tracking-wide">
                Phone/WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2 md:mb-3 tracking-wide">
                College/University *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  placeholder="Enter your college name"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 py-3 md:py-4 px-6 md:px-8 bg-white/5 border border-white/20 text-white rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm md:text-base font-medium"
          >
            Back
          </button>
        )}
        <button
          type={step === 1 ? 'button' : 'submit'}
          onClick={step === 1 ? () => setStep(2) : undefined}
          disabled={isSubmitting}
          className="flex-1 py-3 md:py-4 px-6 md:px-8 bg-gradient-to-r from-cyan-500 to-white text-black rounded-xl md:rounded-2xl font-semibold hover:from-cyan-400 hover:to-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 text-sm md:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Registering...</span>
              <span className="sm:hidden">Loading...</span>
            </>
          ) : step === 1 ? (
            'Next Step'
          ) : (
            <>
              <span className="hidden sm:inline">Join Now – Limited Seats</span>
              <span className="sm:hidden">Join Now</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};


// Main Webinar Page Component
export default function WebinarPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState(23);

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate decreasing seats
    const interval = setInterval(() => {
      setSeatsLeft(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Subtle moving gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0A0A0A] to-black opacity-50" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-16"
          >
            {/* Main Headline */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight tracking-tight"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              Turn Your Skills Into a{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                Career in Tech
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Join our free live webinar and learn how students can build real projects & land internships in 2025
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-12"
            >
              <p className="text-sm text-gray-500 mb-6 tracking-widest uppercase">Next Webinar Starts In</p>
              <CountdownTimer />
            </motion.div>

            {/* CTA Button - Glassmorphism */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const formSection = document.getElementById('registration-form');
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-white rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Reserve My Free Seat
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            {/* Urgency Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-8 flex items-center justify-center gap-3 text-cyan-400"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium tracking-wide">Only {seatsLeft} seats left</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0A0A0A] to-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Why Join Our Webinar?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300">
                    <benefit.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="registration-form" className="py-12 md:py-20 px-4 bg-black">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Reserve Your Free Webinar Seat
              </h2>
              <p className="text-sm md:text-base text-gray-400">
                Get instant access to our FREE AI MODEL guide after registration
              </p>
            </div>
            
            <WebinarForm onSeatUpdate={() => setSeatsLeft(prev => Math.max(1, prev - 1))} />
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-12"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Trusted by Students Learning
          </motion.h2>
          
          {/* Tech Stack Logos */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {techStackLogos.map((tech, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-3 group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-5xl text-white/80 group-hover:text-white transition-colors duration-300">
                  {tech.icon}
                </div>
                <span className="text-gray-400 text-sm font-medium tracking-wide">{tech.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Animated Counter - Apple Keynote Style */}
          <motion.div
            className="text-4xl md:text-5xl font-light text-white mb-6"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent"
            >
              5000+
            </motion.span>
            <div className="text-lg md:text-xl text-gray-400 font-light mt-4">
              students already registered
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 leading-tight tracking-tight"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            Don't Miss Out –{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              Your Career Starts Here
            </span>
          </motion.h2>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const formSection = document.getElementById('registration-form');
              if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative inline-flex items-center gap-3 px-12 py-6 text-lg font-medium text-black rounded-3xl bg-gradient-to-r from-cyan-400 to-white hover:from-cyan-300 hover:to-gray-100 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/30 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Star className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            Register Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </div>
      </section>

      {/* Live Registration Popup */}
      <AnimatePresence>
        {showPopup && <LiveRegistrationPopup />}
      </AnimatePresence>

      {/* Inspirational Quote Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              "You need to learn a skill that makes you{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent font-semibold">
                irreplaceable
              </span>
              ."
            </blockquote>
            <p className="text-gray-400 text-lg">
              Start your journey today
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
