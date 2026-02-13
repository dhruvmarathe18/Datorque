import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NIYANTRA by Datorque",
  description: "Privacy Policy for NIYANTRA coaching institute management platform. GDPR and DPDPA compliant.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Privacy Policy
          </h1>
          <p className="text-indigo-200/60">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how Datorque (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects
            your personal information when you use the NIYANTRA coaching institute management application
            (&quot;the App&quot;). We are committed to protecting your privacy and comply with India&apos;s Digital
            Personal Data Protection Act, 2023 (DPDPA) and GDPR where applicable.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, role (Admin/Teacher/Student)</li>
            <li><strong>Institute Information:</strong> Institute name, address, contact details</li>
            <li><strong>Student Data:</strong> Student names, parent/guardian details, batch assignments, academic records</li>
            <li><strong>Fee Records:</strong> Payment amounts, dates, and methods</li>
            <li><strong>Content:</strong> Homework submissions, test results, chat messages, notices, study materials</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>Device information (type, OS version, app version)</li>
            <li>Usage analytics (feature usage, session duration)</li>
            <li>Crash reports and error logs</li>
            <li>Push notification tokens (Firebase Cloud Messaging)</li>
          </ul>

          <h3>2.3 Information We Do NOT Collect</h3>
          <ul>
            <li>Location data (GPS)</li>
            <li>Contact lists or call logs</li>
            <li>Photos or media (except what you explicitly upload)</li>
            <li>Biometric data</li>
          </ul>

          <h2>3. OCR Camera Feature</h2>
          <p>
            NIYANTRA includes an OCR (Optical Character Recognition) feature that allows users to scan
            questions using their device camera. <strong>All OCR processing happens entirely on-device using
            Google ML Kit.</strong> No images or scanned text are uploaded to our servers or any third-party service.
            Camera access is only activated when you explicitly use the scan feature.
          </p>

          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>Provide and maintain the NIYANTRA service</li>
            <li>Send attendance, fee, homework, and notice notifications</li>
            <li>Generate reports and analytics for institute administrators</li>
            <li>Improve the App based on usage patterns</li>
            <li>Provide customer support</li>
            <li>Send important service updates</li>
          </ul>

          <h2>5. Data Storage & Security</h2>
          <p>
            Your data is stored on <strong>Supabase</strong> (enterprise-grade PostgreSQL) with:
          </p>
          <ul>
            <li>Encryption at rest and in transit (TLS 1.3)</li>
            <li>Row-Level Security (RLS) ensuring complete data isolation between institutes</li>
            <li>Regular automated backups</li>
            <li>Access controls and audit logs</li>
          </ul>

          <h2>6. Data Sharing</h2>
          <p>We do <strong>NOT</strong> sell, rent, or trade your personal information. We may share data with:</p>
          <ul>
            <li><strong>Service providers:</strong> Supabase (database), Firebase (push notifications), Vercel (hosting) — only as needed to operate the service</li>
            <li><strong>Legal requirements:</strong> When required by law, court order, or government regulation</li>
          </ul>

          <h2>7. Data Retention</h2>
          <ul>
            <li>Active accounts: Data retained as long as the account is active</li>
            <li>Deleted accounts: Data permanently deleted within 30 days of account deletion</li>
            <li>Inactive accounts: Notified after 12 months of inactivity; deleted after 18 months</li>
          </ul>

          <h2>8. Your Rights</h2>
          <p>Under DPDPA and GDPR, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> your personal data</li>
            <li><strong>Correct</strong> inaccurate data</li>
            <li><strong>Delete</strong> your data (&quot;Right to be Forgotten&quot;)</li>
            <li><strong>Export</strong> your data in a portable format (CSV/PDF)</li>
            <li><strong>Withdraw consent</strong> for data processing</li>
            <li><strong>Lodge complaints</strong> with the Data Protection Board of India</li>
          </ul>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            NIYANTRA may store data of students who are minors. This data is collected and managed by the
            coaching institute (the &quot;Data Fiduciary&quot; under DPDPA). Institutes must obtain verifiable
            parental consent before adding students under 18 years of age.
          </p>

          <h2>10. Third-Party Services</h2>
          <ul>
            <li><strong>Supabase:</strong> Database hosting — <a href="https://supabase.com/privacy" className="text-indigo-600">Privacy Policy</a></li>
            <li><strong>Firebase:</strong> Push notifications & analytics — <a href="https://firebase.google.com/support/privacy" className="text-indigo-600">Privacy Policy</a></li>
            <li><strong>Google ML Kit:</strong> On-device OCR — No data transmitted</li>
          </ul>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            via email or in-app notification at least 15 days before the changes take effect.
          </p>

          <h2>12. Contact Us</h2>
          <p>For privacy-related inquiries:</p>
          <ul>
            <li>Email: <a href="mailto:support@datorque.com" className="text-indigo-600">support@datorque.com</a></li>
            <li>Website: <a href="https://datorque.com/contact" className="text-indigo-600">datorque.com/contact</a></li>
          </ul>
        </div>
      </section>
    </>
  );
}
