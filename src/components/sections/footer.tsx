"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = {
  services: [
    { name: "Business Websites", href: "/services/business-websites" },
    { name: "eCommerce Solutions", href: "/services/ecommerce" },
    { name: "Landing Pages", href: "/services/landing-pages" },
    { name: "Speed & SEO", href: "/services/speed-seo" },
    { name: "UI/UX Design", href: "/services/ui-ux" },
    { name: "Maintenance", href: "/services/maintenance" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Portfolio", href: "/portfolio" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Support", href: "/support" },
    { name: "Documentation", href: "/docs" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refunds" },
    { name: "GDPR", href: "/gdpr" },
    { name: "Sitemap", href: "/sitemap" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "GitHub", href: "#", icon: Github },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-dark-900 to-dark-950 border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-bold text-text-primary">Datorque</span>
              </Link>

              {/* Tagline */}
              <p className="text-text-muted text-sm leading-relaxed">
                Fueling your digital momentum. We create premium websites that convert visitors into customers and drive business growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-text-muted">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>hello@datorque.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-text-muted">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-text-muted">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Mumbai, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-surface/50 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Stay Updated
            </h3>
            <p className="text-text-muted mb-6">
              Get the latest web design trends, tips, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-surface/50 border border-primary/20 rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button variant="gradient" className="group">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          >
            <div className="text-sm text-text-muted">
              © 2024 Datorque. All rights reserved. Made with ❤️ in India.
            </div>
            <div className="flex items-center space-x-6 text-sm text-text-muted">
              <span>GST: 27ABCDE1234F1Z5</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
