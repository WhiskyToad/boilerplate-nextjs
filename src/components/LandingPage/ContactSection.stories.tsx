import type { Meta, StoryObj } from "@storybook/react";
import ContactSection from "./ContactSection";

const meta: Meta<typeof ContactSection> = {
  title: "Landing Page/ContactSection",
  component: ContactSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {
  args: {},
};

export const WithoutForm: Story = {
  args: {
    title: "Contact Information",
    subtitle: "Reach out to us through any of these channels",
    includeForm: false,
    contactInfo: {
      email: "support@example.com",
      phone: "+1 (800) 123-4567",
      address: "123 Business Avenue, Suite 200, San Francisco, CA 94107",
    },
  },
};

export const SalesContact: Story = {
  args: {
    title: "Contact Our Sales Team",
    subtitle: "Let us help you find the right solution for your business needs",
    formTitle: "Request Information",
    contactInfo: {
      email: "sales@example.com",
      phone: "+1 (800) 555-1234",
      address:
        "Corporate Headquarters: 456 Enterprise Blvd, New York, NY 10001",
    },
  },
};

export const SupportContact: Story = {
  args: {
    title: "Customer Support",
    subtitle: "We're here to help with any questions or issues you might have",
    formTitle: "Submit a Support Request",
    contactInfo: {
      email: "help@example.com",
      phone: "+1 (800) 987-6543",
      address: "Support Center: 789 Service Road, Austin, TX 78701",
    },
  },
};

export const MinimalContact: Story = {
  args: {
    title: "Get In Touch",
    subtitle: "We'd love to hear from you",
    formTitle: "Send us a message",
    contactInfo: {
      email: "hello@example.com",
      phone: undefined,
      address: undefined,
    },
  },
};
