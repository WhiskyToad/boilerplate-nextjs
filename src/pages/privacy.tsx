import React from "react";
import { NextPage } from "next";
import Link from "next/link";

const PrivacyPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">Last updated: April 16, 2025</p>

        <p className="mb-6">
          At Boost Toad, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our service.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul>
          <li>Account information (name, email address, password)</li>
          <li>Profile information</li>
          <li>Project data and content you create within the Service</li>
          <li>Communications you have with us</li>
          <li>Payment information when you subscribe to premium features</li>
        </ul>
        <p>
          We also automatically collect certain information when you use our
          Service, including:
        </p>
        <ul>
          <li>Log information</li>
          <li>Device information</li>
          <li>Usage information</li>
          <li>Location information</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our Service</li>
          <li>Process transactions</li>
          <li>Send you technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Develop new products and services</li>
          <li>Monitor and analyze trends and usage</li>
          <li>
            Detect, investigate, and prevent fraudulent transactions and
            unauthorized access
          </li>
          <li>Personalize your experience</li>
        </ul>

        <h2>3. Data Storage and Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access, loss,
          or damage. However, no method of transmission over the Internet or
          electronic storage is 100% secure.
        </p>

        <h2>4. Information Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers who perform services on our behalf</li>
          <li>Partners with whom we offer co-branded services or promotions</li>
          <li>In response to legal requirements</li>
          <li>With your consent</li>
        </ul>

        <h2>5. Your Rights and Choices</h2>
        <p>
          You may update, correct, or delete your account information at any
          time by logging into your account settings. You may also request
          access to your personal data, request that we rectify or delete your
          personal data, or object to or restrict the processing of your
          personal data.
        </p>

        <h2>6. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our Service and maintain certain information. You can instruct your
          browser to refuse all cookies or to indicate when a cookie is being
          sent.
        </p>

        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our Service is not intended for individuals under the age of 16. We do
          not knowingly collect personal information from children under 16.
        </p>

        <h2>8. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date.
        </p>

        <h2>9. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
          <br />
          <a href="mailto:privacy@boosttoad.com" className="text-primary">
            privacy@boosttoad.com
          </a>
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

export default PrivacyPage;
