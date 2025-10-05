import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, TrendingUp, Clock, Tag, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "🎬 Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Three Days | DatorQue Entertainment",
  description: "BREAKING: Rishab Shetty's Kantara Chapter 1 achieves Rs 162.85 crore net in India and Rs 235 crore worldwide in just three days. The film rooted in coastal Karnataka's tribal folklore has created a box office storm with strong word-of-mouth and festive demand.",
  keywords: [
    "Kantara Chapter 1",
    "Rishab Shetty",
    "box office collection",
    "Rs 235 crore",
    "Indian cinema",
    "Karnataka folklore",
    "tribal culture",
    "Bollywood news",
    "entertainment news",
    "film industry",
    "Ram Gopal Varma",
    "Anupam Kher",
    "Dhruv Marathe"
  ],
  authors: [{ name: "Dhruv Marathe" }],
  creator: "Dhruv Marathe",
  publisher: "DatorQue",
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "https://datorque.com/news/kantara-chapter-1-grosses-235-crore-worldwide",
  },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: "https://datorque.com/news/kantara-chapter-1-grosses-235-crore-worldwide",
    title: "🎬 BREAKING: Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Just Three Days",
    description: "Rishab Shetty's Kantara Chapter 1 creates box office history with Rs 162.85 crore net in India and Rs 235 crore worldwide in three days. Tribal folklore film breaks records.",
    siteName: "DatorQue Entertainment",
    images: [
      {
        url: "https://pbs.twimg.com/media/G2flY3qbsAAtP2v?format=jpg&name=large",
        width: 1200,
        height: 630,
        alt: "Kantara Chapter 1 - Rishab Shetty's Blockbuster Film",
      },
    ],
    publishedTime: "2025-10-06T00:00:00Z",
    modifiedTime: "2025-10-06T00:00:00Z",
    authors: ["Dhruv Marathe"],
    section: "Entertainment",
    tags: ["Kantara", "Rishab Shetty", "Box Office", "Indian Cinema", "Karnataka"],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎬 BREAKING: Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Just Three Days",
    description: "Rishab Shetty's Kantara Chapter 1 creates box office history with Rs 162.85 crore net in India and Rs 235 crore worldwide in three days.",
    images: ["https://pbs.twimg.com/media/G2flY3qbsAAtP2v?format=jpg&name=large"],
    creator: "@dhruvmarathe",
    site: "@datorque",
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
  other: {
    "article:author": "Dhruv Marathe",
    "article:section": "Entertainment",
    "article:tag": "Kantara,Rishab Shetty,Box Office,Indian Cinema,Karnataka",
    "article:published_time": "2025-10-06T00:00:00Z",
    "article:modified_time": "2025-10-06T00:00:00Z",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Three Days",
  "description": "Rishab Shetty's Kantara Chapter 1, released on October 2, 2025, has achieved Rs 162.85 crore net in India over its opening weekend and Rs 235 crore worldwide by day three.",
  "image": [
    "https://pbs.twimg.com/media/G2flY3qbsAAtP2v?format=jpg&name=large"
  ],
  "author": {
    "@type": "Person",
    "name": "Dhruv Marathe",
    "url": "https://datorque.com/dhruvmarathe",
    "sameAs": [
      "https://linkedin.com/in/dhruvmarathe",
      "https://twitter.com/dhruvmarathe",
      "https://instagram.com/dhruvmarathe",
      "https://github.com/dhruvmarathe"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "DatorQue",
    "logo": {
      "@type": "ImageObject",
      "url": "https://datorque.com/logo.png"
    }
  },
  "datePublished": "2025-10-06T00:00:00Z",
  "dateModified": "2025-10-06T00:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://datorque.com/news/kantara-chapter-1-grosses-235-crore-worldwide"
  },
  "articleSection": "Entertainment",
  "keywords": "Kantara Chapter 1, Rishab Shetty, box office collection, Indian cinema, Karnataka folklore",
  "wordCount": 380,
  "timeRequired": "PT3M"
};

export default function KantaraNewsArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <section className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link 
                href="/news" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Link>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ENTERTAINMENT NEWS
              </span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Bollywood
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Three Days
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By <strong>Dhruv Marathe</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>October 6, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>3 min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 sm:h-80 lg:h-96">
                <Image
                  src="https://pbs.twimg.com/media/G2flY3qbsAAtP2v?format=jpg&name=large"
                  alt="Kantara Chapter 1 - Rishab Shetty's Blockbuster Film"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      🎬 ₹235 CRORE WORLDWIDE
                    </h2>
                    <p className="text-lg opacity-90">
                      Rishab Shetty&apos;s Kantara Chapter 1 breaks box office records
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Article Body */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl font-medium text-gray-900 leading-relaxed">
                    <strong>MUMBAI:</strong> Rishab Shetty&apos;s highly anticipated <strong>Kantara Chapter 1</strong> has created box office history, grossing an impressive <strong>Rs 235 crore worldwide</strong> in just three days since its release on October 2, 2025.
                  </p>
                  
                  <p>
                    The film, which is deeply rooted in coastal Karnataka&apos;s tribal folklore and explores themes of devotion and nature, has achieved <strong>Rs 162.85 crore net in India</strong> over its opening weekend, driven by strong word-of-mouth and festive demand.
                  </p>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-green-800 mb-3">💰 Box Office Breakdown</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• <strong>India Net Collection:</strong> Rs 162.85 crore (3 days)</li>
                      <li>• <strong>Worldwide Gross:</strong> Rs 235 crore (3 days)</li>
                      <li>• <strong>Release Date:</strong> October 2, 2025</li>
                      <li>• <strong>Opening Weekend:</strong> Record-breaking performance</li>
                      <li>• <strong>Festive Demand:</strong> Strong audience response</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cultural Impact & Celebrity Praise</h2>
                  
                  <p>
                    The film has received widespread acclaim from industry veterans and celebrities. <strong>Ram Gopal Varma</strong> and <strong>Anupam Kher</strong> have praised the film for its scale and cultural depth, highlighting how it authentically represents coastal Karnataka&apos;s tribal traditions.
                  </p>
                  
                  <p>
                    Kantara Chapter 1&apos;s success lies in its ability to blend traditional folklore with contemporary storytelling, creating a cinematic experience that resonates with audiences across different regions and cultures.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">🌟 Regional Success</h3>
                    <p className="text-blue-700">
                      Audiences in regions like <strong>Telugu states and Karnataka</strong> have filled theaters, with screenings evoking ritualistic fervor and receiving high critic ratings. The film&apos;s authentic representation of tribal culture has struck a chord with viewers.
                    </p>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Kantara Phenomenon</h2>
                  
                  <p>
                    The original Kantara (2022) was already a massive success, and Chapter 1 continues this legacy by diving deeper into the rich cultural tapestry of coastal Karnataka. The film&apos;s exploration of devotion, nature, and tribal traditions has created a unique space in Indian cinema.
                  </p>
                  
                  <p>
                    Rishab Shetty&apos;s vision of bringing regional stories to mainstream audiences has paid off spectacularly, proving that authentic storytelling and cultural representation can achieve both critical acclaim and commercial success.
                  </p>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-purple-800 mb-3">🎯 Industry Impact</h3>
                    <ul className="space-y-2 text-purple-700">
                      <li>• Sets new benchmark for regional cinema</li>
                      <li>• Proves viability of folklore-based storytelling</li>
                      <li>• Demonstrates power of word-of-mouth marketing</li>
                      <li>• Establishes Rishab Shetty as a visionary filmmaker</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Future Prospects</h2>
                  
                  <p>
                    With such a strong opening, Kantara Chapter 1 is expected to continue its box office dominance in the coming weeks. The film&apos;s success has also sparked discussions about the potential for more regional content in mainstream Indian cinema.
                  </p>
                  
                  <p>
                    The combination of strong storytelling, cultural authenticity, and stellar performances has created a winning formula that other filmmakers are likely to study and emulate in the future.
                  </p>
                </div>
                
                {/* Author Bio */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      DM
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Dhruv Marathe</h3>
                      <p className="text-gray-600 mb-4">
                        Entrepreneur, Founder of DatorQue, and Entertainment Industry Analyst. Expert in digital transformation, AI, and media analytics. Follow for more entertainment insights and industry analysis.
                      </p>
                      <div className="flex items-center gap-4">
                        <a 
                          href="https://linkedin.com/in/dhruvmarathe" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          LinkedIn
                        </a>
                        <a 
                          href="https://twitter.com/dhruvmarathe" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Twitter
                        </a>
                        <a 
                          href="https://instagram.com/dhruvmarathe" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Instagram
                        </a>
                        <a 
                          href="https://github.com/dhruvmarathe" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Article</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share on Twitter
                    </button>
                    <button className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share on LinkedIn
                    </button>
                    <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Kantara", "Rishab Shetty", "Box Office", "Indian Cinema", "Karnataka", "Entertainment News", "Bollywood", "Folklore"].map((tag) => (
                      <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
