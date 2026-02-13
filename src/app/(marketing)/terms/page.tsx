import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — NIYANTRA by Datorque",
  description: "Terms of Service and conditions for using the NIYANTRA coaching institute management platform.",
};

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Terms of Service
          </h1>
          <p className="text-indigo-200/60">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the NIYANTRA application (&quot;the App&quot;) provided by Datorque (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
            you agree to be bound by these Terms of Service. If you do not agree, please do not use the App.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            NIYANTRA is a coaching institute management platform that provides tools for student management,
            attendance tracking, fee management, homework, tests, real-time chat, notice board, study materials,
            reports, push notifications, and OCR scanning capabilities.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use NIYANTRA, your institute administrator must create an account and invite you.
            You are responsible for maintaining the confidentiality of your login credentials.
            Notify us immediately of any unauthorized access to your account.
          </p>
          <ul>
            <li>You must provide accurate and complete registration information</li>
            <li>You are responsible for all activities under your account</li>
            <li>You must not share your account credentials with others</li>
            <li>One person per user account; shared accounts are prohibited</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the App for any unlawful purpose</li>
            <li>Upload or share harmful, abusive, or inappropriate content</li>
            <li>Attempt to gain unauthorized access to other accounts or systems</li>
            <li>Interfere with the operation of the App</li>
            <li>Reverse engineer, decompile, or disassemble the App</li>
            <li>Use the App to send spam or unsolicited communications</li>
          </ul>

          <h2>5. Data Ownership</h2>
          <p>
            All data entered by your institute (student records, attendance, fees, etc.) remains the
            property of your institute. We do not claim ownership of your data. You can export your
            data at any time using the built-in export features.
          </p>

          <h2>6. Payment Terms</h2>
          <p>
            Free tier users can use NIYANTRA at no cost with the limitations outlined in our pricing page.
            Paid plans are billed monthly or annually. All prices are in Indian Rupees (INR) unless stated otherwise.
          </p>
          <ul>
            <li>Payments are non-refundable except within our 30-day money-back guarantee period</li>
            <li>We reserve the right to change pricing with 30 days&apos; notice</li>
            <li>Failure to pay may result in service suspension</li>
          </ul>

          <h2>7. Service Availability</h2>
          <p>
            We strive to maintain 99.9% uptime but do not guarantee uninterrupted service.
            We may perform scheduled maintenance with prior notice. We are not liable for any
            downtime or data loss due to circumstances beyond our control.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            The NIYANTRA name, logo, and all associated trademarks are property of Datorque.
            The App&apos;s source code, design, and architecture are proprietary and protected by
            intellectual property laws.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Datorque shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the App.
            Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your access if you violate these terms. You may terminate
            your account at any time by contacting us. Upon termination, your data will be retained
            for 30 days, after which it will be permanently deleted.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of India. Any disputes shall be subject to
            the exclusive jurisdiction of the courts in Maharashtra, India.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes
            via email or in-app notification. Continued use after changes constitutes acceptance.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, contact us at:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@datorque.com" className="text-indigo-600">support@datorque.com</a></li>
            <li>Website: <a href="https://datorque.com" className="text-indigo-600">datorque.com</a></li>
          </ul>
        </div>
      </section>
    </>
  );
}
