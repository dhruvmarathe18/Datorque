import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { ChatWidget } from "@/components/ui/chat-widget";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "DatorQue - Premium Website Development for Indian Businesses",
  description: "Build faster, convert higher. DatorQue creates premium websites for Indian brands—speedy, SEO-solid, and designed to sell. Get your quote today.",
  keywords: [
    "website development",
    "web design",
    "ecommerce development",
    "SEO optimization",
    "Indian web agency",
    "Bangalore web developers",
    "responsive design",
    "digital marketing"
  ],
  authors: [{ name: "DatorQue Team" }],
  creator: "DatorQue",
  publisher: "DatorQue",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://datorque.com"),
  alternates: {
    canonical: "/",
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
    type: "website",
    locale: "en_IN",
    url: "https://datorque.com",
    title: "DatorQue - Premium Website Development for Indian Businesses",
    description: "Build faster, convert higher. DatorQue creates premium websites for Indian brands—speedy, SEO-solid, and designed to sell.",
    siteName: "DatorQue",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DatorQue - Premium Website Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DatorQue - Premium Website Development for Indian Businesses",
    description: "Build faster, convert higher. DatorQue creates premium websites for Indian brands—speedy, SEO-solid, and designed to sell.",
    images: ["/og-image.jpg"],
    creator: "@datorque",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
