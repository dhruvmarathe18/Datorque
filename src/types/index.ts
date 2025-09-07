// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  startingPrice: number;
  timeline: string;
  deliverables: string[];
  process: string[];
  successMetrics: string[];
  faqs: FAQ[];
}

// Portfolio types
export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  industry: string;
  stack: string[];
  description: string;
  problem: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  liveUrl: string;
  previewImage: string;
  previewVideo?: string;
  gallery: string[];
  testimonial?: Testimonial;
  lighthouseScore: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  beforeAfter?: {
    before: string;
    after: string;
  };
  tags: string[];
  year: number;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  project?: string;
  verified: boolean;
}

// Pricing types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  billing: "one-time" | "monthly" | "yearly";
  features: string[];
  limitations: string[];
  popular: boolean;
  cta: string;
  addOns?: AddOn[];
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

// FAQ types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Contact types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  source: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  external?: boolean;
}

export interface NavConfig {
  main: NavItem[];
  footer: NavItem[];
  social: NavItem[];
}

// Theme types
export type Theme = "dark" | "light" | "system";

// Animation types
export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  industry: FilterOption[];
  stack: FilterOption[];
  year: FilterOption[];
  tags: FilterOption[];
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  featured: boolean;
  coverImage: string;
  readTime: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// SEO types
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

// Animation variants
export interface AnimationVariants {
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

// Marquee types
export interface MarqueeItem {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

// Stats types
export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

// Feature types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  image?: string;
}

// Process types
export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  deliverables: string[];
}

// Technology types
export interface Technology {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "cms" | "deployment" | "analytics";
  logo: string;
  description: string;
  website: string;
}

// Industry types
export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  challenges: string[];
  solutions: string[];
  caseStudies: string[];
}

// Performance types
export interface PerformanceMetrics {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  status: "excellent" | "good" | "needs-improvement" | "poor";
  description: string;
}

// Error types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Loading types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// Toast types
export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
