"use client";

import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Features", href: "/features" },
    { name: "Download", href: "/download" },
    { name: "WhatsApp Us", href: "https://wa.me/918956501983?text=Hi%2C%20I'm%20interested%20in%20NIYANTRA%20for%20my%20coaching%20institute." },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  Support: [
    { name: "Help Center", href: "/contact" },
    { name: "Status", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1E1B4B] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <ellipse cx="12" cy="12" rx="10" ry="6" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Poppins' }}>NIYANTRA</span>
            </Link>
            <p className="text-sm text-indigo-200/50 mb-4">
              Smart Coaching. Simplified.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {["twitter", "linkedin", "instagram", "youtube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label={s}
                >
                  <span className="text-xs text-indigo-300/60 uppercase font-mono">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'Poppins' }}>{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-indigo-200/50 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-indigo-200/40">
            © 2026 Datorque. All rights reserved.
          </p>
          <p className="text-xs text-indigo-200/30">
            Made with ❤️ in India (Bangalore + Nashik)
          </p>
        </div>
      </div>
    </footer>
  );
}
