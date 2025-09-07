"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Globe, ShoppingCart, Target, Zap, Palette, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const serviceIcons = {
  "business-websites": Globe,
  "ecommerce": ShoppingCart,
  "landing-pages": Target,
  "speed-seo": Zap,
  "ui-ux-brand": Palette,
  "maintenance": Shield,
};

export function Services() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            From concept to launch, we provide end-to-end web solutions that drive results for your business.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.id as keyof typeof serviceIcons];
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card 
                  variant="glass" 
                  hover 
                  className="h-full hover:scale-105 transition-all duration-300 hover:shadow-glow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-text-muted">
                      {service.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Key Features */}
                    <div className="space-y-2">
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-text-muted">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Pricing & Timeline */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-2xl font-bold text-text-primary">
                          ₹{service.startingPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-text-muted">Starting from</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-text-primary">
                          {service.timeline}
                        </div>
                        <div className="text-xs text-text-muted">Timeline</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card variant="glass" className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Need a custom solution?
            </h3>
            <p className="text-text-muted mb-6">
              We specialize in creating tailored web solutions that meet your unique business requirements.
            </p>
            <Button size="lg" variant="gradient">
              Discuss Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
