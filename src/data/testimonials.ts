import { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    company: "TechStartup",
    role: "CEO",
    avatar: "/testimonials/sarah-johnson.jpg",
    content: "Datorque transformed our platform completely. The new design is not only beautiful but also incredibly functional. Our users love it and our conversion rates have skyrocketed by 180%. The team's attention to detail and understanding of our business needs was exceptional.",
    rating: 5,
    project: "TechStartup SaaS Platform",
    verified: true
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    company: "Fashion Forward",
    role: "Founder",
    avatar: "/testimonials/priya-sharma.jpg",
    content: "The new website has completely transformed our online business. The mobile experience is incredible and our sales have increased by over 300%. The team understood our vision perfectly and delivered beyond our expectations. Highly recommend Datorque!",
    rating: 5,
    project: "Fashion Forward eCommerce",
    verified: true
  },
  {
    id: "dr-rajesh-kumar",
    name: "Dr. Rajesh Kumar",
    company: "MediCare Hospital",
    role: "Medical Director",
    avatar: "/testimonials/rajesh-kumar.jpg",
    content: "The patient portal has revolutionized how we interact with our patients. It's secure, user-friendly, and has significantly improved our operational efficiency. The team's expertise in healthcare technology and compliance requirements was impressive.",
    rating: 5,
    project: "MediCare Patient Portal",
    verified: true
  },
  {
    id: "prof-anjali-patel",
    name: "Prof. Anjali Patel",
    company: "EduLearn Academy",
    role: "Academic Director",
    avatar: "/testimonials/anjali-patel.jpg",
    content: "The new platform has transformed our online education delivery. Students are more engaged, completion rates are higher, and our instructors love the new tools. The learning curve was minimal and the results were immediate.",
    rating: 5,
    project: "EduLearn Online Academy",
    verified: true
  },
  {
    id: "chef-vikram-singh",
    name: "Chef Vikram Singh",
    company: "TasteBuds Restaurant",
    role: "Owner & Head Chef",
    avatar: "/testimonials/vikram-singh.jpg",
    content: "The booking system has revolutionized our restaurant operations. We can now manage reservations efficiently and our customers love the seamless experience. Our table utilization has increased by 35% and customer satisfaction is at an all-time high.",
    rating: 5,
    project: "TasteBuds Restaurant Booking",
    verified: true
  },
  {
    id: "rohit-agarwal",
    name: "Rohit Agarwal",
    company: "WealthWise Financial",
    role: "CEO",
    avatar: "/testimonials/rohit-agarwal.jpg",
    content: "The dashboard has transformed how our clients interact with their financial data. It's secure, intuitive, and provides insights they never had before. The data visualization is exceptional and our client satisfaction has improved dramatically.",
    rating: 5,
    project: "WealthWise Financial Dashboard",
    verified: true
  },
  {
    id: "neha-gupta",
    name: "Neha Gupta",
    company: "GreenTech Solutions",
    role: "Marketing Director",
    avatar: "/testimonials/neha-gupta.jpg",
    content: "Working with Datorque was a game-changer for our digital presence. They understood our sustainability mission and created a website that perfectly represents our brand values. The SEO improvements alone have increased our organic traffic by 250%.",
    rating: 5,
    project: "GreenTech Corporate Website",
    verified: true
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    company: "StartupHub",
    role: "Co-founder",
    avatar: "/testimonials/arjun-mehta.jpg",
    content: "Datorque delivered an exceptional product that exceeded our expectations. The team's technical expertise and creative approach helped us launch our startup with a professional, scalable platform. The ongoing support has been outstanding.",
    rating: 5,
    project: "StartupHub Platform",
    verified: true
  },
  {
    id: "dr-sneha-reddy",
    name: "Dr. Sneha Reddy",
    company: "Wellness Clinic",
    role: "Founder",
    avatar: "/testimonials/sneha-reddy.jpg",
    content: "The website has been instrumental in growing our practice. The appointment booking system is flawless, and the patient portal has improved our service delivery significantly. Our patient satisfaction scores have never been higher.",
    rating: 5,
    project: "Wellness Clinic Website",
    verified: true
  },
  {
    id: "vikas-sharma",
    name: "Vikas Sharma",
    company: "RetailMax",
    role: "Operations Manager",
    avatar: "/testimonials/vikas-sharma.jpg",
    content: "The eCommerce solution Datorque built for us has been phenomenal. Our online sales have increased by 400% and the platform handles our peak traffic seamlessly. The integration with our existing systems was smooth and efficient.",
    rating: 5,
    project: "RetailMax eCommerce",
    verified: true
  }
];

export const featuredTestimonials = testimonials.slice(0, 6);

export const testimonialStats = [
  {
    id: "satisfaction",
    value: "98%",
    label: "Client Satisfaction",
    description: "Our clients consistently rate us 5 stars"
  },
  {
    id: "retention",
    value: "95%",
    label: "Client Retention",
    description: "Clients continue working with us long-term"
  },
  {
    id: "referrals",
    value: "85%",
    label: "Referral Rate",
    description: "Clients refer us to their network"
  },
  {
    id: "delivery",
    value: "100%",
    label: "On-Time Delivery",
    description: "We deliver projects on schedule"
  }
];
