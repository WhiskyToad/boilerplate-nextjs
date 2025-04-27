import React from "react";
import { NextPage } from "next";
import Link from "next/link";

const TermsPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">Last updated: April 16, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Boost Toad (&quot;Service&quot;), you agree to
          be bound by these Terms and Conditions. If you disagree with any part
          of these terms, you may not access the Service.
        </p>

        <h2>2. Use of the Service</h2>
        <p>
          Boost Toad provides a platform for users to create, organize, and
          manage product development projects. The Service is provided &quot;as
          is&quot; and &quot;as available&quot; without warranties of any kind.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for maintaining the
          confidentiality of your account and password, and you agree to accept
          responsibility for all activities that occur under your account.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are
          owned by Boost Toad and are protected by international copyright,
          trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2>5. User Content</h2>
        <p>
          You retain any rights to content you submit, post, or display on or
          through the Service. By submitting content to the Service, you grant
          us a worldwide, non-exclusive, royalty-free license to use, reproduce,
          modify, adapt, publish, and display such content.
        </p>

        <h2>6. Prohibited Uses</h2>
        <p>
          You may not use the Service for any illegal purpose or to transmit any
          material that is unlawful, harmful, threatening, abusive, harassing,
          defamatory, vulgar, or otherwise objectionable.
        </p>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend access to our Service immediately, without
          prior notice or liability, for any reason whatsoever, including
          without limitation if you breach the Terms.
        </p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranties of any
          kind, whether express or implied, including, but not limited to,
          implied warranties of merchantability, fitness for a particular
          purpose, or non-infringement.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Boost Toad shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of or
          inability to use the Service.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the jurisdiction in which
          the company is registered, without regard to its conflict of law
          provisions.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will
          provide notice of any significant changes by posting the new Terms on
          this page.
        </p>

        <div className="mt-12">
          <Link href="/login" className="btn btn-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
