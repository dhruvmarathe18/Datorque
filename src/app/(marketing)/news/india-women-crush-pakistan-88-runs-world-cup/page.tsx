import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, TrendingUp, Clock, Tag, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "🏏 India Women Crush Pakistan by 88 Runs in World Cup Clash | DatorQue Digital Solutions",
  description: "BREAKING: India's women's cricket team defeats Pakistan by 88 runs in ICC Women's World Cup 2025. Learn how DatorQue's digital solutions help sports businesses build winning strategies. Read more & get your digital transformation consultation!",
  keywords: [
    "India women cricket",
    "Pakistan women cricket",
    "ICC Women's World Cup 2025",
    "Harmanpreet Kaur",
    "Kranti Gaud",
    "cricket controversies",
    "toss dispute",
    "run-out decision",
    "Colombo R Premadasa Stadium",
    "women's ODI",
    "cricket news",
    "Dhruv Marathe",
    "sports websites",
    "digital transformation",
    "web development"
  ],
  authors: [{ name: "Dhruv Marathe" }],
  creator: "Dhruv Marathe",
  publisher: "DatorQue",
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "https://datorque.com/news/india-women-crush-pakistan-88-runs-world-cup",
  },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: "https://datorque.com/news/india-women-crush-pakistan-88-runs-world-cup",
    title: "🏏 BREAKING: India Women Crush Pakistan by 88 Runs in Controversial World Cup Clash",
    description: "India's women's cricket team defeats Pakistan by 88 runs in ICC Women's World Cup 2025. Harmanpreet Kaur's half-century leads to victory amid toss and run-out controversies.",
    siteName: "DatorQue Sports",
    images: [
      {
        url: "https://pbs.twimg.com/media/G2fuYoaW0AAEhQR?format=jpg&name=medium",
        width: 1200,
        height: 630,
        alt: "India Women vs Pakistan Women Cricket Match - ICC Women's World Cup 2025",
      },
    ],
    publishedTime: "2025-10-06T00:00:00Z",
    modifiedTime: "2025-10-06T00:00:00Z",
    authors: ["Dhruv Marathe"],
    section: "Sports",
    tags: ["Cricket", "India Women", "Pakistan Women", "World Cup", "Controversy"],
  },
  twitter: {
    card: "summary_large_image",
    title: "🏏 BREAKING: India Women Crush Pakistan by 88 Runs in Controversial World Cup Clash",
    description: "India defeats Pakistan by 88 runs in ICC Women's World Cup 2025. Harmanpreet Kaur's half-century leads victory amid toss and run-out controversies.",
    images: ["https://pbs.twimg.com/media/G2fuYoaW0AAEhQR?format=jpg&name=medium"],
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
    "article:section": "Sports",
    "article:tag": "Cricket,India Women,Pakistan Women,World Cup,Controversy",
    "article:published_time": "2025-10-06T00:00:00Z",
    "article:modified_time": "2025-10-06T00:00:00Z",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "India Women Crush Pakistan by 88 Runs in World Cup Clash Marred by Toss and Run-Out Disputes",
  "description": "India's women's cricket team defeated Pakistan by 88 runs in their ICC Women's World Cup 2025 group-stage match at Colombo's R. Premadasa Stadium.",
  "image": [
    "https://pbs.twimg.com/media/G2fuYoaW0AAEhQR?format=jpg&name=medium"
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
    "@id": "https://datorque.com/news/india-women-crush-pakistan-88-runs-world-cup"
  },
  "articleSection": "Sports",
  "keywords": "India women cricket, Pakistan women cricket, ICC Women's World Cup 2025, Harmanpreet Kaur, cricket controversies",
  "wordCount": 420,
  "timeRequired": "PT3M"
};

export default function CricketNewsArticle() {
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
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                SPORTS NEWS
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Cricket
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              India Women Crush Pakistan by 88 Runs in World Cup Clash Marred by Toss and Run-Out Disputes
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
                  src="https://pbs.twimg.com/media/G2fuYoaW0AAEhQR?format=jpg&name=medium"
                  alt="India Women vs Pakistan Women Cricket Match - ICC Women's World Cup 2025"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      🏏 INDIA WINS BY 88 RUNS
                    </h2>
                    <p className="text-lg opacity-90">
                      Harmanpreet Kaur leads India to victory in controversial match
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Article Body */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl font-medium text-gray-900 leading-relaxed">
                    <strong>COLOMBO:</strong> India&apos;s women&apos;s cricket team delivered a commanding performance, defeating Pakistan by <strong>88 runs</strong> in their ICC Women&apos;s World Cup 2025 group-stage match at Colombo&apos;s R. Premadasa Stadium on Sunday.
                  </p>
                  
                  <p>
                    Captain <strong>Harmanpreet Kaur</strong> led from the front with a brilliant half-century, helping India post a competitive total of <strong>247 runs</strong>. The Indian bowling attack, spearheaded by <strong>Kranti Gaud</strong> who claimed impressive figures of <strong>3-20</strong>, restricted Pakistan to just <strong>159 runs</strong>.
                  </p>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-green-800 mb-3">🏆 Match Highlights</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• <strong>India Total:</strong> 247 runs (Harmanpreet Kaur 50+)</li>
                      <li>• <strong>Pakistan Total:</strong> 159 runs (All out)</li>
                      <li>• <strong>Victory Margin:</strong> 88 runs</li>
                      <li>• <strong>Best Bowler:</strong> Kranti Gaud (3-20)</li>
                      <li>• <strong>Unbeaten Streak:</strong> 12 ODIs vs Pakistan</li>
                    </ul>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Controversies Mar the Match</h2>
                  
                  <p>
                    Despite the convincing victory, the match was overshadowed by several controversial incidents that have sparked debates across the cricket world.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Toss Controversy</h3>
                  <p>
                    The match began with a disputed coin toss where pronunciation issues led to confusion, resulting in Pakistan opting to field first. The incident raised questions about communication protocols in international cricket.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Skipped Handshakes</h3>
                  <p>
                    Tensions were evident as captains <strong>Harmanpreet Kaur</strong> and <strong>Fatima Sana</strong> skipped the traditional post-match handshakes, indicating the intensity of the rivalry and the controversies that unfolded during the game.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Run-Out Decision Reversal</h3>
                  <p>
                    A crucial moment came when a run-out decision involving <strong>Muneeba Ali</strong> was reversed, prompting protests from the Indian team. The decision sparked heated discussions about the consistency of umpiring standards in women&apos;s cricket.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">🐛 Unusual Interruptions</h3>
                    <p className="text-yellow-700">
                      The match also faced unexpected challenges with <strong>insect swarm interruptions</strong> affecting play, adding another layer of drama to an already eventful encounter.
                    </p>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Historical Significance</h2>
                  
                  <p>
                    This victory marked a significant milestone as it was the <strong>first time Pakistan bowled out India</strong> in a Women&apos;s ODI World Cup game. The result extends India&apos;s unbeaten streak to <strong>12 ODIs</strong> against Pakistan, further cementing their dominance in this historic rivalry.
                  </p>
                  
                  <p>
                    The match at Colombo&apos;s R. Premadasa Stadium showcased the growing competitiveness of women&apos;s cricket while highlighting the need for improved communication and decision-making protocols in international matches. Sports organizations can leverage <Link href="/services" className="text-blue-600 hover:text-blue-800 underline">modern web development and digital transformation</Link> solutions to enhance their operations and fan engagement.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Key Takeaways</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• India maintains dominance with 12-match unbeaten streak</li>
                      <li>• Harmanpreet Kaur&apos;s leadership crucial in high-pressure situations</li>
                      <li>• Cricket controversies highlight need for better protocols</li>
                      <li>• Women&apos;s cricket continues to grow in intensity and quality</li>
                      <li>• <Link href="/dhruvmarathe" className="text-blue-600 hover:text-blue-800 underline">Innovative leadership</Link> drives success in competitive environments</li>
                    </ul>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Build Your Winning Digital Strategy?
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                      Just like India&apos;s cricket team&apos;s strategic victory, your business can achieve dominance with the right <strong>web development and digital transformation</strong> approach. Let DatorQue help you build your digital presence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/services"
                        className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                      >
                        Explore Our Digital Solutions
                        <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                      </Link>
                      <Link
                        href="/dhruvmarathe"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-colors"
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
                        Entrepreneur, Founder of DatorQue, and Sports Industry Analyst. Expert in digital transformation, AI, and cricket analytics. Follow for more sports insights and tech analysis.
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
                    {["Cricket", "India Women", "Pakistan Women", "World Cup", "Harmanpreet Kaur", "Sports News", "ICC", "Controversy"].map((tag) => (
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
