import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import getSiteConfig from "@/utils/siteConfig";

const TermsPage: NextPage = () => {
  const config = getSiteConfig();
  const lastUpdated = config.get("legal.terms.lastUpdated", "January 1, 2023");
  const termsContent = config.get("legal.terms.sections", []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">Last updated: {lastUpdated}</p>

        {termsContent.map((section: any, index: number) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}

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
