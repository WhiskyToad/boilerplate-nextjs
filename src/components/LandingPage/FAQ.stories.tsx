import type { Meta, StoryObj } from "@storybook/react";
import FAQ from "./FAQ";

const meta: Meta<typeof FAQ> = {
  title: "Landing Page/FAQ",
  component: FAQ,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FAQ>;

export const Default: Story = {
  args: {},
};

export const ProductFAQ: Story = {
  args: {
    title: "Product FAQs",
    faqs: [
      {
        question: "What makes your product different?",
        answer: (
          <p>
            Our product stands out with its intuitive user interface, powerful
            automation capabilities, and dedicated customer support. Unlike
            competitors, we focus on providing a seamless experience that adapts
            to your workflow, not the other way around.
          </p>
        ),
      },
      {
        question: "How long does implementation take?",
        answer: (
          <p>
            Most customers are up and running within a day. Our setup wizard
            guides you through the process, and our support team is available to
            help if you encounter any issues. Enterprise customers with complex
            requirements may need additional configuration time.
          </p>
        ),
      },
      {
        question: "Do you offer training and onboarding?",
        answer: (
          <>
            <p>
              Yes, we provide comprehensive training and onboarding support:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Free video tutorials for all users</li>
              <li>Weekly live webinars for new features</li>
              <li>
                Dedicated onboarding specialist for Business and Enterprise
                plans
              </li>
              <li>Custom training sessions available for teams</li>
            </ul>
          </>
        ),
      },
      {
        question: "Can I export my data?",
        answer: (
          <p>
            Absolutely. We believe your data belongs to you. You can export your
            data at any time in various formats including CSV, JSON, and PDF. We
            also offer an API for automated data extraction if needed.
          </p>
        ),
      },
    ],
    defaultOpenIndex: 0,
  },
};

export const PricingFAQ: Story = {
  args: {
    title: "Pricing & Billing Questions",
    faqs: [
      {
        question: "Do you offer a free trial?",
        answer: (
          <p>
            Yes, we offer a 14-day free trial on all paid plans. No credit card
            is required to start your trial, and you'll receive a reminder
            before it ends.
          </p>
        ),
      },
      {
        question: "What payment methods do you accept?",
        answer: (
          <p>
            We accept all major credit cards (Visa, MasterCard, American
            Express, Discover), PayPal, and bank transfers for annual plans.
            Enterprise customers can also pay by invoice.
          </p>
        ),
      },
      {
        question: "Can I change plans later?",
        answer: (
          <p>
            Yes, you can upgrade or downgrade your plan at any time. When
            upgrading, the new features will be immediately available and we'll
            prorate the cost. When downgrading, the changes will take effect at
            the start of your next billing cycle.
          </p>
        ),
      },
      {
        question: "Do you offer refunds?",
        answer: (
          <p>
            We offer a 30-day money-back guarantee for first-time purchases. If
            you're not satisfied with our product, contact our support team
            within 30 days of your initial purchase for a full refund.
          </p>
        ),
      },
      {
        question: "Are there any long-term contracts?",
        answer: (
          <p>
            No, all our plans are available on a monthly subscription basis with
            no long-term commitment. We also offer annual plans at a discounted
            rate for customers who prefer to pay yearly.
          </p>
        ),
      },
    ],
    defaultOpenIndex: -1,
  },
};
