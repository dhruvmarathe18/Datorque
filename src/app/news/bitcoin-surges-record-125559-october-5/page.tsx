import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, TrendingUp, Clock, Tag, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "₿ Bitcoin Surges to Record $125,559 High on October 5 | DatorQue Crypto",
  description: "BREAKING: Bitcoin achieves new all-time high of $125,559 on October 5, 2025, boosting market cap above $2.5 trillion. Total crypto market reaches $4.35 trillion amid U.S. government shutdown uncertainties and safe-haven demand.",
  keywords: [
    "Bitcoin",
    "cryptocurrency",
    "BTC price",
    "$125,559",
    "all-time high",
    "market capitalization",
    "$2.5 trillion",
    "Ethereum",
    "$4,600",
    "crypto market",
    "$4.35 trillion",
    "U.S. government shutdown",
    "safe-haven demand",
    "Dhruv Marathe"
  ],
  authors: [{ name: "Dhruv Marathe" }],
  creator: "Dhruv Marathe",
  publisher: "DatorQue",
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "https://datorque.com/news/bitcoin-surges-record-125559-october-5",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://datorque.com/news/bitcoin-surges-record-125559-october-5",
    title: "₿ BREAKING: Bitcoin Surges to Record $125,559 High on October 5",
    description: "Bitcoin achieves new all-time high of $125,559, boosting market cap above $2.5 trillion. Total crypto market reaches $4.35 trillion amid U.S. government shutdown uncertainties.",
    siteName: "DatorQue Crypto",
    images: [
      {
        url: "https://pbs.twimg.com/media/G2e8RnQXUAATLr1?format=png&name=small",
        width: 1200,
        height: 630,
        alt: "Bitcoin Price Chart - New All-Time High $125,559",
      },
    ],
    publishedTime: "2025-10-06T00:00:00Z",
    modifiedTime: "2025-10-06T00:00:00Z",
    authors: ["Dhruv Marathe"],
    section: "Cryptocurrency",
    tags: ["Bitcoin", "Cryptocurrency", "Price Surge", "Market Cap", "Ethereum"],
  },
  twitter: {
    card: "summary_large_image",
    title: "₿ BREAKING: Bitcoin Surges to Record $125,559 High on October 5",
    description: "Bitcoin achieves new all-time high of $125,559, boosting market cap above $2.5 trillion. Total crypto market reaches $4.35 trillion.",
    images: ["https://pbs.twimg.com/media/G2e8RnQXUAATLr1?format=png&name=small"],
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
    "article:section": "Cryptocurrency",
    "article:tag": "Bitcoin,Cryptocurrency,Price Surge,Market Cap,Ethereum",
    "article:published_time": "2025-10-06T00:00:00Z",
    "article:modified_time": "2025-10-06T00:00:00Z",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Bitcoin Surges to Record $125,559 High on October 5",
  "description": "Bitcoin achieved a new all-time high of $125,559 on October 5, 2025, boosting its market capitalization above $2.5 trillion and the total cryptocurrency market to $4.35 trillion.",
  "image": [
    "https://pbs.twimg.com/media/G2e8RnQXUAATLr1?format=png&name=small"
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
    "@id": "https://datorque.com/news/bitcoin-surges-record-125559-october-5"
  },
  "articleSection": "Cryptocurrency",
  "keywords": "Bitcoin, cryptocurrency, BTC price, market capitalization, Ethereum, crypto market",
  "wordCount": 400,
  "timeRequired": "PT3M"
};

export default function BitcoinNewsArticle() {
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
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                CRYPTO NEWS
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Bitcoin
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bitcoin Surges to Record $125,559 High on October 5
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
                  src="https://pbs.twimg.com/media/G2e8RnQXUAATLr1?format=png&name=small"
                  alt="Bitcoin Price Chart - New All-Time High $125,559"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      ₿ $125,559 NEW ATH
                    </h2>
                    <p className="text-lg opacity-90">
                      Bitcoin breaks all-time high record on October 5, 2025
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Article Body */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl font-medium text-gray-900 leading-relaxed">
                    <strong>NEW YORK:</strong> Bitcoin achieved a historic milestone on October 5, 2025, surging to a new all-time high of <strong>$125,559</strong>, marking one of the most significant price movements in cryptocurrency history.
                  </p>
                  
                  <p>
                    The rally has propelled Bitcoin&apos;s market capitalization above <strong>$2.5 trillion</strong>, while the total cryptocurrency market has reached an impressive <strong>$4.35 trillion</strong>, demonstrating the growing mainstream adoption and institutional interest in digital assets.
                  </p>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-green-800 mb-3">📈 Market Performance</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• <strong>Bitcoin Price:</strong> $125,559 (New All-Time High)</li>
                      <li>• <strong>Bitcoin Market Cap:</strong> $2.5+ trillion</li>
                      <li>• <strong>Total Crypto Market:</strong> $4.35 trillion</li>
                      <li>• <strong>Ethereum Price:</strong> $4,600+</li>
                      <li>• <strong>Date:</strong> October 5, 2025</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Driving Factors Behind the Surge</h2>
                  
                  <p>
                    The rally unfolded against a backdrop of <strong>U.S. government shutdown uncertainties</strong>, with analysts pointing to several key factors driving the surge. <strong>Safe-haven demand</strong> has been a primary catalyst as investors seek alternative stores of value during economic uncertainty.
                  </p>
                  
                  <p>
                    Additionally, <strong>declining exchange balances</strong> have significantly reduced selling pressure, creating a supply squeeze that has contributed to the upward price momentum. This trend indicates that long-term holders are increasingly reluctant to sell their Bitcoin positions.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Key Market Indicators</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• <strong>Safe-haven demand</strong> during economic uncertainty</li>
                      <li>• <strong>Declining exchange balances</strong> reducing sell pressure</li>
                      <li>• <strong>Historical October gains</strong> pattern continuation</li>
                      <li>• <strong>Institutional adoption</strong> accelerating</li>
                      <li>• <strong>Community optimism</strong> with projections up to $130,000</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ethereum and Altcoin Performance</h2>
                  
                  <p>
                    The Bitcoin rally has had a positive spillover effect on the broader cryptocurrency market. <strong>Ethereum</strong> has climbed past <strong>$4,600</strong>, benefiting from the overall market sentiment and its growing utility in decentralized finance (DeFi) and non-fungible tokens (NFTs).
                  </p>
                  
                  <p>
                    The correlation between Bitcoin and other major cryptocurrencies suggests that the current bull run is driven by fundamental factors affecting the entire digital asset ecosystem, rather than isolated Bitcoin-specific developments.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Community Response and Future Projections</h2>
                  
                  <p>
                    The cryptocurrency community has responded with <strong>quiet optimism</strong> to the new all-time high, with many analysts and traders projecting further gains. Some market participants are eyeing the <strong>$130,000</strong> level as the next major resistance point.
                  </p>
                  
                  <p>
                    The combination of technical indicators, fundamental adoption trends, and macroeconomic factors suggests that this rally may have more room to run, though volatility remains a constant feature of the cryptocurrency markets.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">⚠️ Market Considerations</h3>
                    <ul className="space-y-2 text-yellow-700">
                      <li>• <strong>High volatility</strong> remains a key characteristic</li>
                      <li>• <strong>Regulatory developments</strong> could impact future performance</li>
                      <li>• <strong>Macroeconomic factors</strong> continue to influence price action</li>
                      <li>• <strong>Technical analysis</strong> suggests potential for further gains</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Implications for the Crypto Ecosystem</h2>
                  
                  <p>
                    Bitcoin&apos;s new all-time high represents more than just a price milestone—it signifies the continued maturation of the cryptocurrency market and its growing acceptance as a legitimate asset class. The $2.5 trillion market capitalization puts Bitcoin in the same league as some of the world&apos;s largest companies and economies.
                  </p>
                  
                  <p>
                    As the cryptocurrency market continues to evolve, this record-breaking performance serves as a reminder of the transformative potential of digital assets and their role in the future of finance.
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
                        Entrepreneur, Founder of DatorQue, and Cryptocurrency Market Analyst. Expert in digital transformation, AI, and blockchain technology. Follow for more crypto insights and market analysis.
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
                    {["Bitcoin", "Cryptocurrency", "Price Surge", "Market Cap", "Ethereum", "Crypto News", "Blockchain", "Digital Assets"].map((tag) => (
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
