"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizModal } from "@/components/ui/quiz-modal";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const services = [
  {
    name: "Business Websites",
    href: "/services/business-websites",
    description: "Professional websites that convert visitors into customers",
  },
  {
    name: "eCommerce Solutions",
    href: "/services/ecommerce",
    description: "Complete online stores that sell products effectively",
  },
  {
    name: "Landing Pages",
    href: "/services/landing-pages",
    description: "High-converting pages that maximize marketing ROI",
  },
  {
    name: "Speed & SEO",
    href: "/services/speed-seo",
    description: "Optimize existing websites for speed and search rankings",
  },
  {
    name: "UI/UX Design",
    href: "/services/ui-ux",
    description: "Beautiful designs that engage and convert users",
  },
  {
    name: "Maintenance",
    href: "/services/maintenance",
    description: "Ongoing support to keep your website running perfectly",
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);
  const [isQuizOpen, setIsQuizOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-text-primary">Datorque</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-text-secondary"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleServices}
                className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <span>Services</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isServicesOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 glass rounded-2xl p-4 shadow-xl"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {services.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="block p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <div className="font-medium text-text-primary">{service.name}</div>
                          <div className="text-sm text-text-muted">{service.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button 
              variant="gradient" 
              size="sm"
              onClick={() => setIsQuizOpen(true)}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-base font-medium transition-colors duration-200",
                    pathname === item.href
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Services */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-sm font-medium text-text-muted mb-3">Services</div>
                <div className="space-y-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="block p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="font-medium text-text-primary">{service.name}</div>
                      <div className="text-sm text-text-muted">{service.description}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="gradient" 
                  className="w-full"
                  onClick={() => {
                    setIsQuizOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Get Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </motion.nav>
  );
}
