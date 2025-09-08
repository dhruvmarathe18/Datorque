import { PortfolioItem } from "@/types";

export const portfolioItems: PortfolioItem[] = [
  {
    id: "techstartup-saas",
    title: "Bangalore Real Estate Co",
    client: "Real Estate Category",
    industry: "Real Estate",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"],
    description: "A comprehensive SaaS platform for project management with real-time collaboration features, advanced analytics, and seamless user experience.",
    problem: "TechStartup needed a modern, scalable platform to manage their growing user base and complex project workflows. Their existing solution was slow, outdated, and couldn't handle their growth.",
    solution: "We built a modern SaaS platform with real-time features, advanced project management tools, and a beautiful, intuitive interface that scales with their business.",
    results: [
      {
        metric: "Page Load Speed",
        value: "1.2s",
        improvement: "+65% faster"
      },
      {
        metric: "User Engagement",
        value: "3.4x",
        improvement: "+240% increase"
      },
      {
        metric: "Conversion Rate",
        value: "12.5%",
        improvement: "+180% improvement"
      },
      {
        metric: "User Satisfaction",
        value: "4.8/5",
        improvement: "+60% improvement"
      }
    ],
    liveUrl: "https://www.blrrealestate.com/",
    previewImage: "/portfolio/techstartup-preview.jpg",
    previewVideo: "/v1.mp4",
    gallery: [
      "/portfolio/techstartup-1.jpg",
      "/portfolio/techstartup-2.jpg",
      "/portfolio/techstartup-3.jpg",
      "/portfolio/techstartup-4.jpg"
    ],
    testimonial: {
      id: "techstartup-testimonial",
      name: "Sarah Johnson",
      company: "TechStartup",
      role: "CEO",
      avatar: "/testimonials/sarah-johnson.jpg",
      content: "DatorQue transformed our platform completely. The new design is not only beautiful but also incredibly functional. Our users love it and our conversion rates have skyrocketed.",
      rating: 5,
      project: "TechStartup SaaS Platform",
      verified: true
    },
    lighthouseScore: {
      performance: 98,
      accessibility: 96,
      bestPractices: 100,
      seo: 94
    },
    beforeAfter: {
      before: "/portfolio/techstartup-before.jpg",
      after: "/portfolio/techstartup-after.jpg"
    },
    tags: ["SaaS", "Real-time", "Analytics", "Modern UI"],
    year: 2025
  },
  {
    id: "fashion-ecommerce",
    title: "Revive - The Elite Fitness",
    client: "Fitness Category",
    industry: "Fitness",
    stack: ["Shopify", "Liquid", "JavaScript", "CSS3", "Shopify Apps"],
    description: "The Elite Fitness Club — designed to reflect strength, luxury, and motivation. With a sleek dark theme, bold typography, and dynamic visuals, the website captures the energy of fitness while providing an effortless user experience",
    problem: "Fashion Forward's existing website had poor mobile experience, slow loading times, and low conversion rates. They needed a modern, mobile-first solution that could showcase their products effectively.",
    solution: "We created a beautiful, mobile-first eCommerce experience with advanced product filtering, AR try-on features, and optimized checkout flow that increased conversions significantly.",
    results: [
      {
        metric: "Mobile Conversion",
        value: "8.2%",
        improvement: "+320% increase"
      },
      {
        metric: "Average Order Value",
        value: "₹2,450",
        improvement: "+45% increase"
      },
      {
        metric: "Cart Abandonment",
        value: "35%",
        improvement: "-40% reduction"
      },
      {
        metric: "Page Load Speed",
        value: "1.8s",
        improvement: "+70% faster"
      }
    ],
    liveUrl: "https://www.reviveblr.com/",
    previewImage: "/portfolio/fashion-preview.jpg",
    previewVideo: "/v2.mp4",
    gallery: [
      "/portfolio/fashion-1.jpg",
      "/portfolio/fashion-2.jpg",
      "/portfolio/fashion-3.jpg",
      "/portfolio/fashion-4.jpg"
    ],
    testimonial: {
      id: "fashion-testimonial",
      name: "Priya Sharma",
      company: "Fashion Forward",
      role: "Founder",
      avatar: "/testimonials/priya-sharma.jpg",
      content: "The new website has completely transformed our online business. The mobile experience is incredible and our sales have increased by over 300%. Highly recommend DatorQue!",
      rating: 5,
      project: "Fashion Forward eCommerce",
      verified: true
    },
    lighthouseScore: {
      performance: 95,
      accessibility: 92,
      bestPractices: 98,
      seo: 96
    },
    beforeAfter: {
      before: "/portfolio/fashion-before.jpg",
      after: "/portfolio/fashion-after.jpg"
    },
    tags: ["eCommerce", "Fashion", "Mobile-first", "AR Features"],
    year: 2025
  },
  {
    id: "healthcare-portal",
    title: "Dubai Beauty School",
    client: "Beauty Category",
    industry: "Healthcare",
    stack: ["React", "Node.js", "MongoDB", "Express", "JWT", "AWS"],
    description: "Datorque created a sophisticated and elegant website for The Beauty Academy — the ultimate destination for aspiring beauty professionals. Designed with a clean pastel theme, graceful typography, and smooth animations, the website reflects glamour and trust",
    problem: "MediCare needed a secure, user-friendly patient portal that could handle sensitive medical data while providing an excellent user experience for patients of all ages.",
    solution: "We built a HIPAA-compliant patient portal with intuitive design, secure data handling, and features that make healthcare management easy for patients and providers.",
    results: [
      {
        metric: "Patient Satisfaction",
        value: "4.7/5",
        improvement: "+85% improvement"
      },
      {
        metric: "Appointment Booking",
        value: "78%",
        improvement: "+200% increase"
      },
      {
        metric: "Portal Adoption",
        value: "92%",
        improvement: "+150% increase"
      },
      {
        metric: "Admin Efficiency",
        value: "65%",
        improvement: "+65% time saved"
      }
    ],
    liveUrl: "https://dubaibeautyschool.com/",
    previewImage: "/portfolio/healthcare-preview.jpg",
    previewVideo: "/v3.mp4",
    gallery: [
      "/portfolio/healthcare-1.jpg",
      "/portfolio/healthcare-2.jpg",
      "/portfolio/healthcare-3.jpg",
      "/portfolio/healthcare-4.jpg"
    ],
    testimonial: {
      id: "healthcare-testimonial",
      name: "Dr. Rajesh Kumar",
      company: "MediCare Hospital",
      role: "Medical Director",
      avatar: "/testimonials/rajesh-kumar.jpg",
      content: "The patient portal has revolutionized how we interact with our patients. It's secure, user-friendly, and has significantly improved our operational efficiency.",
      rating: 5,
      project: "MediCare Patient Portal",
      verified: true
    },
    lighthouseScore: {
      performance: 97,
      accessibility: 98,
      bestPractices: 100,
      seo: 89
    },
    beforeAfter: {
      before: "/portfolio/healthcare-before.jpg",
      after: "/portfolio/healthcare-after.jpg"
    },
    tags: ["Healthcare", "Security", "Patient Portal", "HIPAA Compliant"],
    year: 2025
  },
  {
    id: "education-platform",
    title: "Oakridge International School",
    client: "Educational Category",
    industry: "Education",
    stack: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL", "Vercel"],
    description: "All-In-One platform for quality education. With a clean academic theme, structured layouts, and interactive elements, the website ensures easy access to courses, admissions, events, and resources.",
    problem: "EduLearn needed a modern, scalable platform to deliver online courses effectively. Their existing solution was outdated and couldn't handle the growing number of students and courses.",
    solution: "We built a modern learning management system with video streaming, interactive features, progress tracking, and a beautiful interface that engages students and instructors.",
    results: [
      {
        metric: "Student Engagement",
        value: "4.2x",
        improvement: "+320% increase"
      },
      {
        metric: "Course Completion",
        value: "78%",
        improvement: "+180% increase"
      },
      {
        metric: "Instructor Satisfaction",
        value: "4.6/5",
        improvement: "+120% improvement"
      },
      {
        metric: "Platform Uptime",
        value: "99.9%",
        improvement: "+15% improvement"
      }
    ],
    liveUrl: "https://www.oakridge.in/bengaluru/",
    previewImage: "/portfolio/education-preview.jpg",
    previewVideo: "/v4.mp4",
    gallery: [
      "/portfolio/education-1.jpg",
      "/portfolio/education-2.jpg",
      "/portfolio/education-3.jpg",
      "/portfolio/education-4.jpg"
    ],
    testimonial: {
      id: "education-testimonial",
      name: "Prof. Anjali Patel",
      company: "EduLearn Academy",
      role: "Academic Director",
      avatar: "/testimonials/anjali-patel.jpg",
      content: "The new platform has transformed our online education delivery. Students are more engaged, completion rates are higher, and our instructors love the new tools.",
      rating: 5,
      project: "EduLearn Online Academy",
      verified: true
    },
    lighthouseScore: {
      performance: 96,
      accessibility: 94,
      bestPractices: 98,
      seo: 92
    },
    beforeAfter: {
      before: "/portfolio/education-before.jpg",
      after: "/portfolio/education-after.jpg"
    },
    tags: ["Education", "LMS", "Video Streaming", "Interactive Learning"],
    year: 2024
  },
  {
    id: "restaurant-booking",
    title: "The Table - Restaurant",
    client: "Hospitality - Category",
    industry: "Hospitality",
    stack: ["React", "Node.js", "MongoDB", "Stripe", "Twilio", "AWS"],
    description: "A modern restaurant booking and management system with table reservations, online ordering, payment processing, and customer management features.",
    problem: "TasteBuds needed a modern solution to handle online reservations, table management, and customer communication. Their existing system was outdated and couldn't handle peak hours efficiently.",
    solution: "We created a comprehensive restaurant management system with real-time table availability, automated booking confirmations, and seamless customer experience.",
    results: [
      {
        metric: "Online Bookings",
        value: "85%",
        improvement: "+250% increase"
      },
      {
        metric: "Table Utilization",
        value: "92%",
        improvement: "+35% increase"
      },
      {
        metric: "Customer Satisfaction",
        value: "4.8/5",
        improvement: "+90% improvement"
      },
      {
        metric: "No-Show Rate",
        value: "8%",
        improvement: "-60% reduction"
      }
    ],
    liveUrl: "https://foodmatters.in/the-table/",
    previewImage: "/portfolio/restaurant-preview.jpg",
    previewVideo: "/v5.mp4",
    gallery: [
      "/portfolio/restaurant-1.jpg",
      "/portfolio/restaurant-2.jpg",
      "/portfolio/restaurant-3.jpg",
      "/portfolio/restaurant-4.jpg"
    ],
    testimonial: {
      id: "restaurant-testimonial",
      name: "Chef Vikram Singh",
      company: "TasteBuds Restaurant",
      role: "Owner & Head Chef",
      avatar: "/testimonials/vikram-singh.jpg",
      content: "The booking system has revolutionized our restaurant operations. We can now manage reservations efficiently and our customers love the seamless experience.",
      rating: 5,
      project: "TasteBuds Restaurant Booking",
      verified: true
    },
    lighthouseScore: {
      performance: 94,
      accessibility: 96,
      bestPractices: 98,
      seo: 91
    },
    beforeAfter: {
      before: "/portfolio/restaurant-before.jpg",
      after: "/portfolio/restaurant-after.jpg"
    },
    tags: ["Hospitality", "Booking System", "Real-time", "Customer Management"],
    year: 2024
  },
  {
    id: "fintech-dashboard",
    title: "Planet Entertainment",
    client: "Events Category",
    industry: "Lifestyle & Celebrations",
    stack: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL", "AWS"],
    description: "Datorque built a vibrant and dynamic website for The Event Masters — your one-stop destination for unforgettable celebrations. With a bold, festive design, immersive visuals, and smooth animations, the website captures the excitement of weddings, corporate events, and luxury parties.",
    problem: "WealthWise needed a secure, intuitive platform for their clients to track investments and manage portfolios. The existing solution was complex and difficult to use.",
    solution: "We built a modern financial dashboard with real-time data visualization, intuitive portfolio management, and comprehensive analytics that makes complex financial data accessible.",
    results: [
      {
        metric: "User Engagement",
        value: "4.1x",
        improvement: "+310% increase"
      },
      {
        metric: "Task Completion",
        value: "89%",
        improvement: "+180% increase"
      },
      {
        metric: "Client Satisfaction",
        value: "4.7/5",
        improvement: "+95% improvement"
      },
      {
        metric: "Data Accuracy",
        value: "99.8%",
        improvement: "+25% improvement"
      }
    ],
    liveUrl: "https://www.truppandfest.com/",
    previewImage: "/portfolio/fintech-preview.jpg",
    previewVideo: "/v6.mp4",
    gallery: [
      "/portfolio/fintech-1.jpg",
      "/portfolio/fintech-2.jpg",
      "/portfolio/fintech-3.jpg",
      "/portfolio/fintech-4.jpg"
    ],
    testimonial: {
      id: "fintech-testimonial",
      name: "Rohit Agarwal",
      company: "WealthWise Financial",
      role: "CEO",
      avatar: "/testimonials/rohit-agarwal.jpg",
      content: "The dashboard has transformed how our clients interact with their financial data. It's secure, intuitive, and provides insights they never had before.",
      rating: 5,
      project: "WealthWise Financial Dashboard",
      verified: true
    },
    lighthouseScore: {
      performance: 97,
      accessibility: 95,
      bestPractices: 100,
      seo: 88
    },
    beforeAfter: {
      before: "/portfolio/fintech-before.jpg",
      after: "/portfolio/fintech-after.jpg"
    },
    tags: ["Fintech", "Data Visualization", "Real-time", "Security"],
    year: 2024
  }
];

export const portfolioFilters = {
  industry: [
    { value: "all", label: "All Industries", count: portfolioItems.length },
    { value: "SaaS", label: "SaaS", count: portfolioItems.filter(item => item.industry === "SaaS").length },
    { value: "Fashion", label: "Fashion", count: portfolioItems.filter(item => item.industry === "Fashion").length },
    { value: "Healthcare", label: "Healthcare", count: portfolioItems.filter(item => item.industry === "Healthcare").length },
    { value: "Education", label: "Education", count: portfolioItems.filter(item => item.industry === "Education").length },
    { value: "Hospitality", label: "Hospitality", count: portfolioItems.filter(item => item.industry === "Hospitality").length },
    { value: "Fintech", label: "Fintech", count: portfolioItems.filter(item => item.industry === "Fintech").length }
  ],
  stack: [
    { value: "all", label: "All Technologies", count: portfolioItems.length },
    { value: "Next.js", label: "Next.js", count: portfolioItems.filter(item => item.stack.includes("Next.js")).length },
    { value: "React", label: "React", count: portfolioItems.filter(item => item.stack.includes("React")).length },
    { value: "TypeScript", label: "TypeScript", count: portfolioItems.filter(item => item.stack.includes("TypeScript")).length },
    { value: "Shopify", label: "Shopify", count: portfolioItems.filter(item => item.stack.includes("Shopify")).length },
    { value: "Node.js", label: "Node.js", count: portfolioItems.filter(item => item.stack.includes("Node.js")).length },
    { value: "AWS", label: "AWS", count: portfolioItems.filter(item => item.stack.includes("AWS")).length }
  ],
  year: [
    { value: "all", label: "All Years", count: portfolioItems.length },
    { value: "2024", label: "2024", count: portfolioItems.filter(item => item.year === 2024).length },
    { value: "2023", label: "2023", count: portfolioItems.filter(item => item.year === 2023).length },
    { value: "2022", label: "2022", count: portfolioItems.filter(item => item.year === 2022).length }
  ],
  tags: [
    { value: "all", label: "All Tags", count: portfolioItems.length },
    { value: "Real-time", label: "Real-time", count: portfolioItems.filter(item => item.tags.includes("Real-time")).length },
    { value: "Mobile-first", label: "Mobile-first", count: portfolioItems.filter(item => item.tags.includes("Mobile-first")).length },
    { value: "eCommerce", label: "eCommerce", count: portfolioItems.filter(item => item.tags.includes("eCommerce")).length },
    { value: "Security", label: "Security", count: portfolioItems.filter(item => item.tags.includes("Security")).length },
    { value: "Analytics", label: "Analytics", count: portfolioItems.filter(item => item.tags.includes("Analytics")).length },
    { value: "Modern UI", label: "Modern UI", count: portfolioItems.filter(item => item.tags.includes("Modern UI")).length }
  ]
};
