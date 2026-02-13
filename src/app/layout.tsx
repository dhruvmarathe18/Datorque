import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NIYANTRA — The Operating System for Coaching Institutes | Datorque",
  description: "Manage students, staff, attendance, fees, homework, tests, and communication — all from one beautiful app. Built for India's coaching ecosystem by Datorque.",
  keywords: [
    "coaching institute management",
    "NIYANTRA",
    "coaching app",
    "student management",
    "attendance tracking",
    "fee management",
    "coaching center software",
    "education technology India",
    "Datorque",
  ],
  authors: [{ name: "Datorque" }],
  creator: "Datorque",
  publisher: "Datorque",
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
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://datorque.com",
    title: "NIYANTRA — The Operating System for Coaching Institutes",
    description: "Manage students, staff, attendance, fees, homework, tests, and communication — all from one beautiful app.",
    siteName: "NIYANTRA by Datorque",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NIYANTRA — Coaching Institute Management App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIYANTRA — The Operating System for Coaching Institutes",
    description: "Manage students, staff, attendance, fees, homework, tests, and communication — all from one beautiful app.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
