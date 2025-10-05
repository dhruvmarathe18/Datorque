import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, TrendingUp, Clock, Tag, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Elon Musk vs Netflix: AI Lessons for Digital Strategy | DatorQue",
  description: "BREAKING: Elon Musk's viral campaign against Netflix has caused a 5% stock drop, erasing $15 billion in market value. Learn how DatorQue's AI web solutions help businesses navigate digital controversies. Read more & get your AI strategy consultation!",
  keywords: [
    "Elon Musk",
    "Netflix boycott",
    "transgender themes",
    "children shows",
    "Dead End Paranormal Park",
    "stock market",
    "Netflix stock drop",
    "viral campaign",
    "X Twitter",
    "conservative influencers",
    "media representation",
    "tech industry news",
    "Dhruv Marathe",
    "AI web solutions",
    "digital strategy",
    "social media management"
  ],
  authors: [{ name: "Dhruv Marathe" }],
  creator: "Dhruv Marathe",
  publisher: "DatorQue",
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "https://datorque.com/news/elon-musk-netflix-boycott-transgender-themes",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://datorque.com/news/elon-musk-netflix-boycott-transgender-themes",
    title: "🚨 BREAKING: Elon Musk's Netflix Boycott Campaign Erases $15B in Market Value",
    description: "Elon Musk's 26+ viral posts targeting Netflix's transgender content have caused a massive stock drop and sparked global controversy. Full analysis inside.",
    siteName: "DatorQue News",
    images: [
      {
        url: "https://datorque.com/news/elon-musk-netflix-og.jpg",
        width: 1200,
        height: 630,
        alt: "Elon Musk Netflix Boycott Campaign - $15B Market Value Lost",
      },
    ],
    publishedTime: "2025-10-07T00:00:00Z",
    modifiedTime: "2025-10-07T00:00:00Z",
    authors: ["Dhruv Marathe"],
    section: "Tech Industry",
    tags: ["Elon Musk", "Netflix", "Stock Market", "Transgender", "Viral Campaign"],
  },
  twitter: {
    card: "summary_large_image",
    title: "🚨 BREAKING: Elon Musk's Netflix Boycott Erases $15B in Market Value",
    description: "26+ viral posts targeting Netflix's transgender content have caused massive controversy and stock drop. Full analysis:",
    images: ["https://datorque.com/news/elon-musk-netflix-og.jpg"],
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
    "article:section": "Tech Industry",
    "article:tag": "Elon Musk,Netflix,Stock Market,Transgender,Viral Campaign",
    "article:published_time": "2024-12-19T00:00:00Z",
    "article:modified_time": "2024-12-19T00:00:00Z",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Elon Musk Calls for Netflix Boycott Over Transgender Themes in Kids' Shows",
  "description": "Elon Musk has posted over 26 times on X since October 1, urging his 227 million followers to cancel Netflix subscriptions due to transgender characters and themes in children's programming.",
  "image": [
    "https://datorque.com/news/elon-musk-netflix-og.jpg"
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
  "datePublished": "2025-10-07T00:00:00Z",
  "dateModified": "2025-10-07T00:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://datorque.com/news/elon-musk-netflix-boycott-transgender-themes"
  },
  "articleSection": "Tech Industry",
  "keywords": "Elon Musk, Netflix boycott, transgender themes, children shows, stock market",
  "wordCount": 450,
  "timeRequired": "PT3M"
};

export default function NewsArticle() {
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
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                BREAKING NEWS
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Tech Industry
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Elon Musk Calls for Netflix Boycott Over Transgender Themes in Kids&apos; Shows
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By <strong>Dhruv Marathe</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>October 7, 2025</span>
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
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-red-500 to-orange-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      🚨 $15 BILLION LOST
                    </h2>
                    <p className="text-lg opacity-90">
                      Elon Musk&apos;s viral campaign causes massive Netflix stock drop
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Article Body */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl font-medium text-gray-900 leading-relaxed">
                    <strong>BREAKING:</strong> Elon Musk has launched an unprecedented social media campaign against Netflix, posting over <strong>26 times</strong> on X (formerly Twitter) since October 1, urging his <strong>227 million followers</strong> to cancel their Netflix subscriptions.
                  </p>
                  
                  <p>
                    The campaign targets transgender characters and themes in children&apos;s programming, specifically calling out shows like <em>&apos;Dead End: Paranormal Park&apos;</em> for what Musk describes as &quot;inappropriate content&quot; for young audiences.
                  </p>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-red-800 mb-3">📊 Market Impact</h3>
                    <ul className="space-y-2 text-red-700">
                      <li>• <strong>5% drop</strong> in Netflix stock price</li>
                      <li>• <strong>$15 billion</strong> erased from market value</li>
                      <li>• <strong>1 million+ engagements</strong> on boycott hashtags</li>
                      <li>• <strong>Viral trend</strong> amplified by conservative influencers</li>
                    </ul>
                  </div>
                  
                  <p>
                    The campaign has been amplified by conservative influencers and has driven a viral &apos;Cancel Netflix&apos; trend with over <strong>1 million engagements</strong> across social media platforms. This massive social media storm has translated into real-world financial consequences for the streaming giant.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Controversy Explained</h2>
                  
                  <p>
                    Critics of the content argue that it &quot;grooms young audiences&quot; and exposes children to themes they believe are inappropriate. However, supporters of the shows defend them as <strong>inclusive storytelling</strong> that represents diverse experiences and promotes acceptance.
                  </p>
                  
                  <p>
                    This controversy comes amid broader debates about media representation and the role of streaming platforms in shaping cultural narratives, particularly around LGBTQ+ themes in children&apos;s content.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Key Takeaways</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• Social media influence can directly impact stock prices</li>
                      <li>• Content representation debates are driving business decisions</li>
                      <li>• Conservative and progressive voices are clashing over media content</li>
                      <li>• Streaming platforms face increasing pressure over content choices</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industry Implications</h2>
                  
                  <p>
                    This incident highlights the growing power of social media influencers, particularly tech leaders like Musk, to influence consumer behavior and market dynamics. It also underscores the ongoing cultural battles over representation in media and the financial risks companies face when navigating these sensitive topics. Businesses need <Link href="/services" className="text-blue-600 hover:text-blue-800 underline">AI-powered web solutions and digital strategy</Link> to manage their online reputation effectively.
                  </p>
                  
                  <p>
                    As the debate continues to unfold, industry experts are watching closely to see how Netflix and other streaming platforms will respond to this type of coordinated social media pressure. Just as <Link href="/dhruvmarathe" className="text-blue-600 hover:text-blue-800 underline">innovative entrepreneurs and tech leaders</Link> shape industry conversations, businesses must adapt their digital strategies to stay competitive.
                  </p>
                </div>
                
                {/* CTA Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Navigate Digital Controversies?
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                      Just like the Netflix controversy shows, businesses need robust <strong>AI web solutions and digital strategy</strong> to manage online reputation and market dynamics. Let DatorQue help you build a resilient digital presence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/services"
                        className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                      >
                        Explore Our AI Solutions
                        <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                      </Link>
                      <Link
                        href="/dhruvmarathe"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Meet Our Founder
                      </Link>
                    </div>
                  </div>
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
                        Entrepreneur, Founder of DatorQue, and Tech Industry Analyst. Expert in digital transformation, AI, and startup ecosystems. Follow for more industry insights.
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
                    {["Elon Musk", "Netflix", "Stock Market", "Transgender", "Viral Campaign", "Tech News", "Social Media", "Streaming"].map((tag) => (
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
