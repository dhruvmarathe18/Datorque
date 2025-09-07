"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Minus, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizModal } from "@/components/ui/quiz-modal";

interface ProjectFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const projectFeatures: ProjectFeature[] = [
  // Core Features
  { id: "responsive-design", name: "Responsive Design", description: "Mobile-first, works on all devices", price: 0, category: "core" },
  { id: "seo-optimization", name: "SEO Optimization", description: "Search engine optimization basics", price: 0, category: "core" },
  { id: "contact-forms", name: "Contact Forms", description: "Lead capture and contact forms", price: 0, category: "core" },
  { id: "ssl-certificate", name: "SSL Certificate", description: "Secure HTTPS connection", price: 0, category: "core" },
  
  // Pages
  { id: "home-page", name: "Home Page", description: "Landing page with hero section", price: 2999, category: "pages" },
  { id: "about-page", name: "About Page", description: "Company story and team info", price: 1999, category: "pages" },
  { id: "services-page", name: "Services Page", description: "Detailed service descriptions", price: 2499, category: "pages" },
  { id: "portfolio-page", name: "Portfolio Page", description: "Work showcase and case studies", price: 2999, category: "pages" },
  { id: "contact-page", name: "Contact Page", description: "Contact info and location", price: 1499, category: "pages" },
  { id: "blog-page", name: "Blog Page", description: "Content management and blog", price: 3999, category: "pages" },
  
  // Advanced Features
  { id: "cms", name: "Content Management", description: "Easy content updates", price: 4999, category: "advanced" },
  { id: "ecommerce", name: "eCommerce Store", description: "Online store with payments", price: 19999, category: "advanced" },
  { id: "user-accounts", name: "User Accounts", description: "Registration and login system", price: 7999, category: "advanced" },
  { id: "booking-system", name: "Booking System", description: "Appointment scheduling", price: 9999, category: "advanced" },
  { id: "multi-language", name: "Multi-language", description: "Multiple language support", price: 5999, category: "advanced" },
  
  // Design & Animation
  { id: "custom-design", name: "Custom Design", description: "Unique, branded design", price: 7999, category: "design" },
  { id: "animations", name: "Animations", description: "Smooth transitions and effects", price: 2999, category: "design" },
  { id: "illustrations", name: "Custom Illustrations", description: "Unique graphics and icons", price: 4999, category: "design" },
  { id: "video-integration", name: "Video Integration", description: "Background videos and media", price: 1999, category: "design" },
  
  // Marketing & Analytics
  { id: "google-analytics", name: "Google Analytics", description: "Website traffic tracking", price: 0, category: "marketing" },
  { id: "social-media", name: "Social Media Integration", description: "Social sharing and feeds", price: 1999, category: "marketing" },
  { id: "email-marketing", name: "Email Marketing", description: "Newsletter signup and campaigns", price: 3999, category: "marketing" },
  { id: "seo-advanced", name: "Advanced SEO", description: "Technical SEO optimization", price: 4999, category: "marketing" },
  
  // Maintenance
  { id: "hosting", name: "Hosting Setup", description: "Fast, reliable hosting", price: 1999, category: "maintenance" },
  { id: "backup", name: "Backup System", description: "Automatic daily backups", price: 999, category: "maintenance" },
  { id: "maintenance", name: "Maintenance Plan", description: "3 months of updates and support", price: 4999, category: "maintenance" },
  { id: "training", name: "Training Session", description: "Learn to manage your website", price: 1999, category: "maintenance" }
];

const categories = [
  { id: "core", name: "Core Features", color: "bg-green-500/20 border-green-500/30 text-green-400" },
  { id: "pages", name: "Pages", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
  { id: "advanced", name: "Advanced Features", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
  { id: "design", name: "Design & Animation", color: "bg-pink-500/20 border-pink-500/30 text-pink-400" },
  { id: "marketing", name: "Marketing & Analytics", color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
  { id: "maintenance", name: "Maintenance", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" }
];

export function ProjectCalculator() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const getTotalPrice = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = projectFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
  };

  const getFeaturesByCategory = (categoryId: string) => {
    if (categoryId === "all") return projectFeatures;
    return projectFeatures.filter(f => f.category === categoryId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const totalPrice = getTotalPrice();
  const gstAmount = totalPrice * 0.18;
  const finalPrice = totalPrice + gstAmount;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Calculator className="w-4 h-4 mr-2" />
            Project Calculator
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Build Your <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Perfect Website</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the features you need and get an instant price estimate. No hidden costs, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-primary/20 border border-primary/30 text-primary"
                    : "bg-surface-800/50 border border-white/10 text-gray-300 hover:bg-surface-700/50"
                }`}
              >
                All Features
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? category.color
                      : "bg-surface-800/50 border border-white/10 text-gray-300 hover:bg-surface-700/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFeaturesByCategory(selectedCategory).map(feature => {
                const isSelected = selectedFeatures.includes(feature.id);
                const category = categories.find(c => c.id === feature.category);
                
                return (
                  <Card
                    key={feature.id}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/10 border-primary/30 shadow-lg"
                        : "bg-surface-900/50 border-white/10 hover:bg-surface-800/50"
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-white font-semibold">{feature.name}</h3>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                        {category && (
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                            {category.name}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-white">
                          {feature.price === 0 ? "Free" : formatPrice(feature.price)}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-surface-900/50 backdrop-blur-xl border border-white/10 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6">Project Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Selected Features:</span>
                  <span className="text-white">{selectedFeatures.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">GST (18%):</span>
                  <span className="text-white">{formatPrice(gstAmount)}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-primary">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white"
                  onClick={() => setIsQuizOpen(true)}
                >
                  Get Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => {
                    window.open('https://wa.me/919876543210?text=Hi! I\'d like to schedule a consultation for my web development project.', '_blank');
                  }}
                >
                  Schedule Consultation
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Free consultation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No hidden costs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>30-day money back</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </section>
  );
}
