import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech News & Industry Updates | DatorQue",
  description: "Stay updated with the latest tech news, industry insights, and digital transformation trends. Expert analysis from Dhruv Marathe, Founder of DatorQue.",
  keywords: [
    "tech news",
    "industry updates",
    "digital transformation",
    "technology trends",
    "startup news",
    "AI news",
    "web development news"
  ],
  openGraph: {
    title: "Tech News & Industry Updates | DatorQue",
    description: "Stay updated with the latest tech news, industry insights, and digital transformation trends.",
    type: "website",
    url: "https://datorque.com/news",
  },
};

const newsArticles = [
  {
    id: "bitcoin-surges-record-125559-october-5",
    title: "Bitcoin Surges to Record $125,559 High on October 5",
    excerpt: "Bitcoin achieved a new all-time high of $125,559 on October 5, 2025, boosting its market capitalization above $2.5 trillion and the total cryptocurrency market to $4.35 trillion.",
    author: "Dhruv Marathe",
    date: "2025-10-06",
    readTime: "3 min read",
    category: "Cryptocurrency",
    trending: true,
    image: "https://pbs.twimg.com/media/G2e8RnQXUAATLr1?format=png&name=small",
    slug: "bitcoin-surges-record-125559-october-5"
  },
  {
    id: "kantara-chapter-1-grosses-235-crore-worldwide",
    title: "Kantara Chapter 1 Grosses Rs 235 Crore Worldwide in Three Days",
    excerpt: "Rishab Shetty's Kantara Chapter 1, released on October 2, 2025, has achieved Rs 162.85 crore net in India over its opening weekend and Rs 235 crore worldwide by day three, driven by strong word-of-mouth and festive demand.",
    author: "Dhruv Marathe",
    date: "2025-10-06",
    readTime: "3 min read",
    category: "Entertainment",
    trending: true,
    image: "https://pbs.twimg.com/media/G2flY3qbsAAtP2v?format=jpg&name=large",
    slug: "kantara-chapter-1-grosses-235-crore-worldwide"
  },
  {
    id: "india-women-crush-pakistan-88-runs-world-cup",
    title: "India Women Crush Pakistan by 88 Runs in World Cup Clash Marred by Toss and Run-Out Disputes",
    excerpt: "India's women's cricket team defeated Pakistan by 88 runs in their ICC Women's World Cup 2025 group-stage match at Colombo's R. Premadasa Stadium, with captain Harmanpreet Kaur scoring a half-century.",
    author: "Dhruv Marathe",
    date: "2025-10-06",
    readTime: "3 min read",
    category: "Sports",
    trending: true,
    image: "https://pbs.twimg.com/media/G2fuYoaW0AAEhQR?format=jpg&name=medium",
    slug: "india-women-crush-pakistan-88-runs-world-cup"
  },
  {
    id: "elon-musk-netflix-boycott-transgender-themes",
    title: "Elon Musk Calls for Netflix Boycott Over Transgender Themes in Kids' Shows",
    excerpt: "Elon Musk has posted over 26 times on X since October 1, urging his 227 million followers to cancel Netflix subscriptions due to transgender characters and themes in children's programming.",
    author: "Dhruv Marathe",
    date: "2025-10-07",
    readTime: "3 min read",
    category: "Tech Industry",
    trending: true,
    image: "/news/elon-musk-netflix.jpg",
    slug: "elon-musk-netflix-boycott-transgender-themes"
  }
];

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tech News & Industry Updates
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest technology news, industry insights, and expert analysis from the DatorQue team.
            </p>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {newsArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Link 
                      href={`/news?category=${article.category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {article.category}
                    </Link>
                    {article.trending && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    <Link 
                      href={`/news/${article.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link 
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Read More
                      <Share2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
