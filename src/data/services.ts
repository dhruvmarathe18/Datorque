import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "business-websites",
    title: "Business Websites",
    description: "Professional, conversion-focused websites that establish your brand presence and drive business growth. Built with modern technologies and optimized for performance.",
    shortDescription: "Professional websites that convert visitors into customers",
    icon: "Globe",
    features: [
      "Mobile-first responsive design",
      "SEO optimization",
      "Fast loading speeds",
      "Contact forms & lead capture",
      "Analytics integration",
      "Content management system",
      "Security features",
      "SSL certificate"
    ],
    startingPrice: 12999,
    timeline: "2-3 weeks",
    deliverables: [
      "Fully responsive website",
      "Content management system",
      "SEO optimization",
      "Performance optimization",
      "Analytics setup",
      "Training documentation"
    ],
    process: [
      "Discovery & strategy",
      "Design & wireframing",
      "Development & testing",
      "Content integration",
      "Launch & optimization"
    ],
    successMetrics: [
      "Page load speed < 3 seconds",
      "Mobile-friendly score 100%",
      "SEO score 90%+",
      "Conversion rate optimization"
    ],
    faqs: [
      {
        id: "business-websites-1",
        question: "What's included in the basic business website package?",
        answer: "Our basic package includes a 5-page responsive website, contact forms, basic SEO optimization, mobile optimization, and 1 month of free support.",
        category: "general"
      },
      {
        id: "business-websites-2",
        question: "Do you provide content writing services?",
        answer: "Yes, we offer professional content writing services as an add-on. Our team can create compelling copy that converts visitors into customers.",
        category: "content"
      }
    ]
  },
  {
    id: "ecommerce",
    title: "eCommerce Solutions",
    description: "Complete online store solutions using Shopify, WooCommerce, or headless commerce. From product catalogs to payment processing, we handle everything.",
    shortDescription: "Complete online stores that sell products effectively",
    icon: "ShoppingCart",
    features: [
      "Product catalog management",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking system",
      "Customer accounts",
      "Mobile commerce",
      "SEO optimization",
      "Analytics & reporting"
    ],
    startingPrice: 25999,
    timeline: "4-6 weeks",
    deliverables: [
      "Complete eCommerce website",
      "Payment integration",
      "Inventory system",
      "Admin dashboard",
      "Mobile app (optional)",
      "Training & documentation"
    ],
    process: [
      "Requirements analysis",
      "Platform selection",
      "Design & UX",
      "Development & integration",
      "Testing & optimization",
      "Launch & training"
    ],
    successMetrics: [
      "Conversion rate 2-5%",
      "Page load speed < 2 seconds",
      "Mobile conversion optimization",
      "Payment success rate 99%+"
    ],
    faqs: [
      {
        id: "ecommerce-1",
        question: "Which eCommerce platform do you recommend?",
        answer: "We recommend Shopify for most businesses due to its ease of use and reliability. For complex requirements, we can build custom headless solutions.",
        category: "platform"
      },
      {
        id: "ecommerce-2",
        question: "Do you handle payment gateway setup?",
        answer: "Yes, we integrate and configure payment gateways like Razorpay, Stripe, and PayPal. We also handle SSL certificates and security compliance.",
        category: "payments"
      }
    ]
  },
  {
    id: "landing-pages",
    title: "Landing Pages & Funnels",
    description: "High-converting landing pages and sales funnels designed to maximize your marketing ROI. A/B tested and optimized for your target audience.",
    shortDescription: "High-converting pages that maximize marketing ROI",
    icon: "Target",
    features: [
      "Conversion-focused design",
      "A/B testing setup",
      "Lead capture forms",
      "Email integration",
      "Analytics tracking",
      "Mobile optimization",
      "Fast loading speeds",
      "Split testing tools"
    ],
    startingPrice: 15999,
    timeline: "1-2 weeks",
    deliverables: [
      "High-converting landing page",
      "Lead capture system",
      "A/B testing setup",
      "Analytics configuration",
      "Email integration",
      "Performance optimization"
    ],
    process: [
      "Audience research",
      "Conversion strategy",
      "Design & copywriting",
      "Development & testing",
      "Launch & optimization"
    ],
    successMetrics: [
      "Conversion rate 5-15%",
      "Page load speed < 2 seconds",
      "Mobile conversion rate 3-10%",
      "Lead quality score 80%+"
    ],
    faqs: [
      {
        id: "landing-pages-1",
        question: "How do you ensure high conversion rates?",
        answer: "We use proven conversion optimization techniques, A/B testing, and data-driven design decisions based on your target audience and industry best practices.",
        category: "conversion"
      },
      {
        id: "landing-pages-2",
        question: "Can you integrate with my existing CRM?",
        answer: "Yes, we can integrate with most popular CRMs including HubSpot, Salesforce, Pipedrive, and custom solutions.",
        category: "integration"
      }
    ]
  },
  {
    id: "speed-seo",
    title: "Speed & SEO Upgrades",
    description: "Transform your existing website into a high-performance, SEO-optimized powerhouse. Improve rankings, speed, and user experience.",
    shortDescription: "Optimize existing websites for speed and search rankings",
    icon: "Zap",
    features: [
      "Core Web Vitals optimization",
      "Technical SEO audit",
      "Page speed optimization",
      "Mobile performance",
      "Schema markup",
      "Image optimization",
      "Caching implementation",
      "CDN setup"
    ],
    startingPrice: 8999,
    timeline: "1-2 weeks",
    deliverables: [
      "Performance audit report",
      "Speed optimization",
      "SEO improvements",
      "Technical recommendations",
      "Monitoring setup",
      "Before/after metrics"
    ],
    process: [
      "Website audit",
      "Performance analysis",
      "Optimization implementation",
      "Testing & validation",
      "Monitoring setup"
    ],
    successMetrics: [
      "Page load speed improvement 50%+",
      "Core Web Vitals score 90%+",
      "SEO score improvement 30%+",
      "Mobile performance 95%+"
    ],
    faqs: [
      {
        id: "speed-seo-1",
        question: "How much speed improvement can I expect?",
        answer: "Most websites see 40-70% improvement in loading speed, with Core Web Vitals scores reaching 90%+ on mobile and desktop.",
        category: "performance"
      },
      {
        id: "speed-seo-2",
        question: "Will SEO improvements affect my rankings immediately?",
        answer: "Technical SEO improvements can show results in 2-4 weeks, while content and link building strategies take 3-6 months for full impact.",
        category: "seo"
      }
    ]
  },
  {
    id: "ui-ux-brand",
    title: "UI/UX & Brand Design",
    description: "Create stunning visual identities and user experiences that resonate with your audience. From brand guidelines to interactive prototypes.",
    shortDescription: "Beautiful designs that engage and convert users",
    icon: "Palette",
    features: [
      "Brand identity design",
      "User experience research",
      "Interactive prototypes",
      "Design system creation",
      "User testing",
      "Accessibility compliance",
      "Responsive design",
      "Animation & micro-interactions"
    ],
    startingPrice: 19999,
    timeline: "3-4 weeks",
    deliverables: [
      "Complete brand identity",
      "UI/UX designs",
      "Interactive prototypes",
      "Design system",
      "Style guide",
      "User research insights"
    ],
    process: [
      "Brand discovery",
      "User research",
      "Design exploration",
      "Prototyping & testing",
      "Refinement & delivery"
    ],
    successMetrics: [
      "User satisfaction 90%+",
      "Task completion rate 85%+",
      "Accessibility score 95%+",
      "Brand consistency 100%"
    ],
    faqs: [
      {
        id: "ui-ux-1",
        question: "Do you conduct user research?",
        answer: "Yes, we conduct user interviews, surveys, and usability testing to ensure our designs meet your users' needs and expectations.",
        category: "research"
      },
      {
        id: "ui-ux-2",
        question: "Can you create a design system for my brand?",
        answer: "Absolutely! We create comprehensive design systems including color palettes, typography, components, and usage guidelines.",
        category: "design-system"
      }
    ]
  },
  {
    id: "maintenance",
    title: "Maintenance & Care Plans",
    description: "Keep your website running smoothly with our comprehensive maintenance plans. Regular updates, backups, security monitoring, and performance optimization.",
    shortDescription: "Ongoing support to keep your website running perfectly",
    icon: "Shield",
    features: [
      "Regular security updates",
      "Performance monitoring",
      "Backup management",
      "Content updates",
      "Bug fixes",
      "Uptime monitoring",
      "Security scanning",
      "Priority support"
    ],
    startingPrice: 3999,
    timeline: "Ongoing",
    deliverables: [
      "Monthly performance reports",
      "Security updates",
      "Backup verification",
      "Content updates",
      "Bug fixes",
      "24/7 monitoring"
    ],
    process: [
      "Initial assessment",
      "Maintenance setup",
      "Regular monitoring",
      "Proactive updates",
      "Monthly reporting"
    ],
    successMetrics: [
      "Uptime 99.9%+",
      "Security score 100%",
      "Response time < 24 hours",
      "Performance maintained"
    ],
    faqs: [
      {
        id: "maintenance-1",
        question: "What's included in the maintenance plan?",
        answer: "Our plans include security updates, performance monitoring, regular backups, content updates, bug fixes, and priority support.",
        category: "general"
      },
      {
        id: "maintenance-2",
        question: "How quickly do you respond to issues?",
        answer: "We respond to critical issues within 2 hours and resolve them within 24 hours. Non-critical issues are addressed within 48 hours.",
        category: "support"
      }
    ]
  }
];
