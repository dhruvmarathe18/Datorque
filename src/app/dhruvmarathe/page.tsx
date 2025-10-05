import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Mail, Globe, Users, Mic, Code, Brain, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Dhruv Marathe – Entrepreneur, Founder of DatorQue & Public Speaker",
  description: "Dhruv Marathe – Entrepreneur, Public Speaker, and Founder of DatorQue. Expert in AI, web development, and digital transformation. Based in India, empowering startups worldwide.",
  keywords: [
    "Dhruv Marathe",
    "Entrepreneur India",
    "Founder DatorQue",
    "Public Speaker",
    "Tech Innovator",
    "AI",
    "Web Development",
    "React Native",
    "Startup Mentor"
  ],
  authors: [{ name: "Dhruv Marathe" }],
  creator: "Dhruv Marathe",
  publisher: "DatorQue",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "https://datorque.com/dhruvmarathe",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: "https://datorque.com/dhruvmarathe",
    title: "Dhruv Marathe – Entrepreneur, Founder of DatorQue & Public Speaker",
    description: "Dhruv Marathe – Entrepreneur, Public Speaker, and Founder of DatorQue. Expert in AI, web development, and digital transformation. Based in India, empowering startups worldwide.",
    siteName: "DatorQue",
    images: [
      {
        url: "/dhruv-marathe-og.jpg",
        width: 1200,
        height: 630,
        alt: "Dhruv Marathe - Entrepreneur, Founder of DatorQue & Public Speaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv Marathe – Entrepreneur, Founder of DatorQue & Public Speaker",
    description: "Dhruv Marathe – Entrepreneur, Public Speaker, and Founder of DatorQue. Expert in AI, web development, and digital transformation. Based in India, empowering startups worldwide.",
    images: ["/dhruv-marathe-og.jpg"],
    creator: "@dhruvmarathe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dhruv Marathe",
  "jobTitle": ["Entrepreneur", "Public Speaker"],
  "founderOf": {
    "@type": "Organization",
    "name": "DatorQue",
    "url": "https://datorque.com"
  },
  "description": "Entrepreneur, Public Speaker, and Founder of DatorQue. Expert in AI, web development, and digital transformation.",
  "url": "https://datorque.com/dhruvmarathe",
  "image": "https://datorque.com/dhruv-marathe-profile.jpg",
  "sameAs": [
    "https://linkedin.com/in/dhruvmarathe",
    "https://github.com/dhruvmarathe",
    "https://twitter.com/dhruvmarathe",
    "https://instagram.com/dhruvmarathe"
  ],
  "knowsAbout": [
    "Web Development",
    "AI",
    "Entrepreneurship",
    "Public Speaking",
    "Startup Mentorship",
    "Digital Transformation"
  ],
  "alumniOf": "Indian Institute of Technology",
  "nationality": "Indian",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  }
};

export default function DhruvMarathePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              {/* Profile Image */}
              <div className="mb-6 sm:mb-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src="/dhruv-marathe-profile.jpeg"
                    alt="Dhruv Marathe - Entrepreneur, Founder of DatorQue & Public Speaker"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                    priority
                  />
                </div>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Dhruv Marathe
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 font-light px-2">
                Entrepreneur | Founder of DatorQue | Public Speaker
              </p>
              
              {/* Brief Description */}
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-2">
                Empowering startups worldwide through innovative AI-driven solutions and cutting-edge web development. 
                Passionate about transforming ideas into scalable digital products.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">
              About Dhruv Marathe
            </h2>
            
            <div className="prose prose-base sm:prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 sm:space-y-6 px-2">
              <p>
                As a visionary <strong>Entrepreneur</strong> and the <strong>Founder of DatorQue</strong>, 
                Dhruv Marathe has been at the forefront of digital transformation in India. His journey began 
                with a passion for creating AI-driven solutions that solve real-world problems, leading him to 
                establish DatorQue as a premier web development agency.
              </p>
              
              <p>
                Beyond his role as a <strong>Public Speaker</strong>, Dhruv has dedicated his career to 
                empowering startups and businesses through innovative technology. His expertise spans across 
                modern web development frameworks, AI integration, and digital strategy, making him a sought-after 
                mentor in the Indian startup ecosystem.
              </p>
              
              <p>
                Through DatorQue, Dhruv has helped over 150+ businesses transform their digital presence, 
                combining his technical expertise with strategic vision to deliver solutions that drive growth 
                and innovation. His commitment to excellence and client success has established DatorQue as 
                a trusted partner for digital transformation.
              </p>
            </div>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center px-2">
              What I Do
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Web & App Development</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Creating scalable, high-performance web applications using modern technologies like React, 
                  Next.js, and Node.js. Specializing in mobile-first, responsive designs.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">AI-Powered Solutions</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Integrating artificial intelligence and machine learning into business processes to 
                  automate workflows and enhance decision-making capabilities.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Startup Mentorship</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Guiding emerging entrepreneurs through the complexities of building and scaling 
                  technology startups in today&apos;s competitive market.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Public Speaking</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Sharing insights on entrepreneurship, technology trends, and digital transformation 
                  at conferences, workshops, and industry events across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured In / Speaking Engagements */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center px-2">
              Featured In & Speaking Engagements
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Speaking Engagements</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">TechCrunch Startup Battlefield India</p>
                      <p className="text-xs sm:text-sm text-gray-600">Panel Discussion: &ldquo;Future of AI in Indian Startups&rdquo;</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">IIT Bombay Entrepreneurship Summit</p>
                      <p className="text-xs sm:text-sm text-gray-600">Keynote: &ldquo;Building Scalable Tech Companies&rdquo;</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">NASSCOM Product Conclave</p>
                      <p className="text-xs sm:text-sm text-gray-600">Workshop: &ldquo;Digital Transformation Strategies&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Media Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Economic Times</p>
                      <p className="text-xs sm:text-sm text-gray-600">&ldquo;Rising Stars in Indian Tech Entrepreneurship&rdquo;</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">YourStory</p>
                      <p className="text-xs sm:text-sm text-gray-600">&ldquo;How DatorQue is Revolutionizing Web Development&rdquo;</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Inc42</p>
                      <p className="text-xs sm:text-sm text-gray-600">&ldquo;Startup Spotlight: DatorQue&apos;s Growth Story&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
              Let&apos;s Work Together
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Ready to transform your business with cutting-edge technology? 
              Let&apos;s discuss how we can bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <a
                href="mailto:dhruv@datorque.com"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get In Touch
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </a>
              
              <a
                href="https://datorque.com"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Visit DatorQue
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2024 Dhruv Marathe. All rights reserved. | 
              <a href="https://datorque.com" className="text-blue-400 hover:text-blue-300 ml-1">
                DatorQue
              </a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
