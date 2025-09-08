"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Check, X, Star, Zap, Crown, Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pricingPlans, monthlyCarePlans, gstRate } from "@/data/pricing";
import { formatCurrency, getGSTAmount, getTotalWithGST } from "@/lib/utils";
import { cn } from "@/lib/utils";

const planIcons = {
  starter: Zap,
  business: Star,
  growth: Rocket,
  enterprise: Crown,
  "care-starter": Zap,
  "care-business": Star,
  "care-enterprise": Crown,
};

export function Pricing() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = React.useState<"one-time" | "monthly">("one-time");
  const [showGST, setShowGST] = React.useState(false);

  const currentPlans = billingCycle === "one-time" ? pricingPlans : monthlyCarePlans;

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. All prices are in INR and include everything you need to succeed online.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={cn("text-sm font-medium", billingCycle === "one-time" ? "text-text-primary" : "text-text-muted")}>
              One-time Projects
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "one-time" ? "monthly" : "one-time")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  billingCycle === "monthly" ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-text-primary" : "text-text-muted")}>
              Monthly Care
            </span>
          </div>

          {/* GST Toggle */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <input
              type="checkbox"
              id="show-gst"
              checked={showGST}
              onChange={(e) => setShowGST(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
            />
            <label htmlFor="show-gst" className="text-sm text-text-muted">
              Show prices with GST ({gstRate}%)
            </label>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentPlans.map((plan, index) => {
            const IconComponent = planIcons[plan.id as keyof typeof planIcons];
            const finalPrice = showGST ? getTotalWithGST(plan.price, gstRate) : plan.price;
            const gstAmount = showGST ? getGSTAmount(plan.price, gstRate) : 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn("relative", plan.popular && "lg:scale-105")}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <Card 
                  variant={plan.popular ? "elevated" : "glass"} 
                  className={cn(
                    "h-full hover:scale-105 transition-all duration-300",
                    plan.popular && "border-primary/50 shadow-glow"
                  )}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-text-muted">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Pricing */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-text-primary">
                          {formatCurrency(finalPrice, "INR")}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-lg text-text-muted line-through ml-2">
                            {formatCurrency(plan.originalPrice, "INR")}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-muted mt-1">
                        {billingCycle === "one-time" ? "One-time payment" : "Per month"}
                      </div>
                      {showGST && gstAmount > 0 && (
                        <div className="text-xs text-text-muted mt-1">
                          Base: {formatCurrency(plan.price, "INR")} + GST: {formatCurrency(gstAmount, "INR")}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-muted">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations?.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start space-x-3">
                          <X className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-muted opacity-60">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button 
                      variant={plan.popular ? "gradient" : "outline"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons Section */}
        {billingCycle === "one-time" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <Card variant="glass" className="p-8">
              <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
                Popular Add-ons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Logo Design", price: "₹2,999", description: "Custom logo for your brand" },
                  { name: "Content Writing", price: "₹4,999", description: "Professional copywriting" },
                  { name: "SEO Audit", price: "₹2,999", description: "Comprehensive SEO analysis" },
                  { name: "API Integration", price: "₹9,999", description: "Connect with third-party services" },
                ].map((addon, index) => (
                  <div key={index} className="p-4 bg-surface/30 rounded-xl hover:bg-surface/50 transition-colors">
                    <div className="font-medium text-text-primary">{addon.name}</div>
                    <div className="text-sm text-text-muted mb-2">{addon.description}</div>
                    <div className="text-lg font-bold text-primary">{addon.price}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

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
              We offer custom pricing for enterprise clients and unique requirements. Let&apos;s discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient">
                Get Custom Quote
              </Button>
              <Button size="lg" variant="outline">
                Schedule Call
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
