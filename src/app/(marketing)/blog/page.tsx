import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — NIYANTRA by Datorque",
  description: "Tips, guides, and updates about coaching institute management, EdTech, and the NIYANTRA platform.",
};

const posts = [
  {
    title: "5 Signs Your Coaching Institute Needs a Management App",
    excerpt: "Still using paper registers and WhatsApp groups? Here are 5 clear signs it's time to digitize your coaching institute operations.",
    date: "Jan 2025",
    category: "Guides",
    readTime: "5 min read",
  },
  {
    title: "How NIYANTRA Handles Student Data Privacy",
    excerpt: "A deep dive into our security architecture: row-level security, on-device OCR processing, encryption, and DPDPA compliance.",
    date: "Jan 2025",
    category: "Security",
    readTime: "8 min read",
  },
  {
    title: "Attendance Tracking: Paper vs Digital — A Cost Comparison",
    excerpt: "We calculated the hidden costs of manual attendance tracking. The results will surprise you.",
    date: "Dec 2024",
    category: "Insights",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Insights & updates
          </h1>
          <p className="text-lg text-indigo-200/60 max-w-2xl mx-auto">
            Tips, guides, and news about coaching institute management and EdTech.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: 'Poppins' }}>
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center bg-indigo-50 rounded-2xl p-12 border border-indigo-100">
            <span className="text-4xl mb-4 block">✍️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
              More articles coming soon
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We&apos;re working on in-depth guides about coaching institute management, digital transformation
              in education, and product updates. Stay tuned!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
