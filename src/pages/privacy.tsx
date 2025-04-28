import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import getSiteConfig from "@/utils/siteConfig";

const PrivacyPage: NextPage = () => {
  const config = getSiteConfig();
  const companyName = config.get("site.companyName");
  const privacyEmail = config.get("site.privacyEmail");
  const lastUpdated = config.get(
    "legal.privacy.lastUpdated",
    "January 1, 2023"
  );
  const privacyContent = config.get("legal.privacy.sections", []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">Last updated: {lastUpdated}</p>

        <p className="mb-6">
          At {companyName}, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our service.
        </p>

        {privacyContent.map((section: any, index: number) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>

            {section.listItems && section.listItems.length > 0 && (
              <ul>
                {section.listItems.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <h2>Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
          <br />
          <a href={`mailto:${privacyEmail}`} className="text-primary">
            {privacyEmail}
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
