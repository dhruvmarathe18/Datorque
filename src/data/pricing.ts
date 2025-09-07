import { PricingPlan, AddOn } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses and startups looking to establish their online presence",
    price: 12999,
    currency: "INR",
    billing: "one-time",
    features: [
      "1-page landing / mini-site",
      "Mobile-first responsive design",
      "Copy polish & stock assets",
      "Basic SEO optimization",
      "1 contact form",
      "1 round of revisions",
      "Deploy to Vercel (free tier)",
      "Basic analytics setup",
      "SSL certificate",
      "1 month free support"
    ],
    limitations: [
      "No CMS included",
      "Basic animations only",
      "Standard support hours"
    ],
    popular: false,
    cta: "Get Started",
    addOns: [
      {
        id: "logo-design",
        name: "Logo Design",
        description: "Custom logo design for your brand",
        price: 2999,
        currency: "INR"
      },
      {
        id: "content-writing",
        name: "Content Writing",
        description: "Professional copywriting for your website",
        price: 4999,
        currency: "INR"
      }
    ]
  },
  {
    id: "business",
    name: "Business",
    description: "Ideal for growing businesses that need a comprehensive web presence",
    price: 25999,
    originalPrice: 29999,
    currency: "INR",
    billing: "one-time",
    features: [
      "5-7 pages website",
      "Content Management System",
      "Blog functionality",
      "Advanced animations",
      "On-page SEO optimization",
      "Speed optimizations",
      "Schema markup",
      "2 contact forms",
      "Google Analytics & Search Console",
      "2 rounds of revisions",
      "Training handoff session",
      "3 months free support"
    ],
    limitations: [
      "Standard integrations only",
      "Basic eCommerce features"
    ],
    popular: true,
    cta: "Most Popular",
    addOns: [
      {
        id: "ecommerce-basic",
        name: "Basic eCommerce",
        description: "Add product catalog and payment processing",
        price: 9999,
        currency: "INR"
      },
      {
        id: "advanced-seo",
        name: "Advanced SEO",
        description: "Comprehensive SEO audit and optimization",
        price: 7999,
        currency: "INR"
      }
    ]
  },
  {
    id: "growth",
    name: "Growth",
    description: "For established businesses ready to scale their digital presence",
    price: 39999,
    originalPrice: 45999,
    currency: "INR",
    billing: "one-time",
    features: [
      "10-15 pages website",
      "Advanced CMS with workflows",
      "Gated lead magnets",
      "Advanced SEO & content strategy",
      "Case studies & testimonials",
      "Micro-interactions & animations",
      "A/B testing setup",
      "Advanced analytics",
      "3 rounds of revisions",
      "QA suite & testing",
      "Performance optimization",
      "6 months free support"
    ],
    limitations: [
      "No custom integrations",
      "Standard hosting included"
    ],
    popular: false,
    cta: "Scale Up",
    addOns: [
      {
        id: "custom-integrations",
        name: "Custom Integrations",
        description: "Connect with your existing tools and systems",
        price: 14999,
        currency: "INR"
      },
      {
        id: "conversion-optimization",
        name: "Conversion Optimization",
        description: "A/B testing and conversion rate optimization",
        price: 12999,
        currency: "INR"
      }
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large organizations with complex requirements",
    price: 150000,
    currency: "INR",
    billing: "one-time",
    features: [
      "Unlimited pages",
      "Headless commerce solutions",
      "Complex integrations (SSO, APIs)",
      "Custom design system",
      "Advanced security features",
      "SLA & performance guarantees",
      "CRO program included",
      "Dedicated project manager",
      "Unlimited revisions",
      "Priority support & maintenance",
      "Custom hosting solutions",
      "12 months free support"
    ],
    limitations: [],
    popular: false,
    cta: "Contact Sales",
    addOns: [
      {
        id: "multi-region",
        name: "Multi-Region Setup",
        description: "Deploy across multiple regions for global reach",
        price: 25000,
        currency: "INR"
      },
      {
        id: "white-label",
        name: "White-Label Solution",
        description: "Custom branding and white-label options",
        price: 50000,
        currency: "INR"
      }
    ]
  }
];

export const monthlyCarePlans: PricingPlan[] = [
  {
    id: "care-starter",
    name: "Care Starter",
    description: "Essential maintenance for small websites",
    price: 3999,
    currency: "INR",
    billing: "monthly",
    features: [
      "Monthly security updates",
      "Performance monitoring",
      "Weekly backups",
      "Basic content updates (up to 5 hours)",
      "Email support",
      "Uptime monitoring",
      "Basic security scanning"
    ],
    limitations: [
      "Standard support hours only",
      "No emergency support"
    ],
    popular: false,
    cta: "Start Care Plan"
  },
  {
    id: "care-business",
    name: "Care Business",
    description: "Comprehensive maintenance for growing businesses",
    price: 9999,
    currency: "INR",
    billing: "monthly",
    features: [
      "Weekly security updates",
      "Advanced performance monitoring",
      "Daily backups",
      "Content updates (up to 15 hours)",
      "Priority support",
      "Advanced security scanning",
      "Monthly performance reports",
      "Emergency support"
    ],
    limitations: [
      "No custom development",
      "Standard response times"
    ],
    popular: true,
    cta: "Most Popular"
  },
  {
    id: "care-enterprise",
    name: "Care Enterprise",
    description: "Premium maintenance with dedicated support",
    price: 24999,
    currency: "INR",
    billing: "monthly",
    features: [
      "Daily security updates",
      "Real-time performance monitoring",
      "Hourly backups",
      "Unlimited content updates",
      "Dedicated support manager",
      "Advanced security features",
      "Weekly performance reports",
      "24/7 emergency support",
      "Custom development (up to 10 hours)"
    ],
    limitations: [],
    popular: false,
    cta: "Enterprise Care"
  }
];

export const addOns: AddOn[] = [
  {
    id: "logo-refresh",
    name: "Logo Refresh",
    description: "Modernize your existing logo or create a new one",
    price: 2999,
    currency: "INR"
  },
  {
    id: "brand-kit",
    name: "Complete Brand Kit",
    description: "Full brand identity including colors, fonts, and guidelines",
    price: 7999,
    currency: "INR"
  },
  {
    id: "custom-illustrations",
    name: "Custom Illustrations",
    description: "Custom illustrations and graphics for your website",
    price: 4999,
    currency: "INR"
  },
  {
    id: "api-integrations",
    name: "API Integrations",
    description: "Connect your website with third-party services",
    price: 9999,
    currency: "INR"
  },
  {
    id: "copywriting",
    name: "Professional Copywriting",
    description: "Compelling copy that converts visitors into customers",
    price: 4999,
    currency: "INR"
  },
  {
    id: "product-photography",
    name: "Product Photography",
    description: "Professional product photos for your eCommerce site",
    price: 7999,
    currency: "INR"
  },
  {
    id: "speed-audit",
    name: "Speed & SEO Audit",
    description: "Comprehensive audit of your website's performance",
    price: 2999,
    currency: "INR"
  },
  {
    id: "translation",
    name: "Multi-Language Support",
    description: "Translate your website into multiple languages",
    price: 5999,
    currency: "INR"
  }
];

export const gstRate = 18; // 18% GST for India

export const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay using UPI apps like PhonePe, Google Pay, Paytm",
    icon: "Smartphone"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Secure online payments with cards, net banking, wallets",
    icon: "CreditCard"
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    description: "Direct bank transfer (NEFT/RTGS)",
    icon: "Building2"
  },
  {
    id: "installments",
    name: "EMI Options",
    description: "Pay in installments with 0% interest",
    icon: "Calendar"
  }
];
