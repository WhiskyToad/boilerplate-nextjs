import type { Meta, StoryObj } from "@storybook/react";
import ClientLogos from "./ClientLogos";

const meta: Meta<typeof ClientLogos> = {
  title: "Landing Page/ClientLogos",
  component: ClientLogos,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClientLogos>;

export const Default: Story = {
  args: {},
};

export const WithTitle: Story = {
  args: {
    title: "Trusted by Industry Leaders",
    subtitle: "Join hundreds of businesses that rely on our platform every day",
    grayscale: true,
    logos: [
      {
        src: "/logos/logo1.svg",
        alt: "Acme Corporation",
        width: 150,
        height: 50,
        href: "https://example.com",
      },
      {
        src: "/logos/logo2.svg",
        alt: "TechCorp",
        width: 150,
        height: 50,
        href: "https://example.com",
      },
      {
        src: "/logos/logo3.svg",
        alt: "Innovate Inc",
        width: 150,
        height: 50,
        href: "https://example.com",
      },
      {
        src: "/logos/logo4.svg",
        alt: "Future Systems",
        width: 150,
        height: 50,
        href: "https://example.com",
      },
      {
        src: "/logos/logo5.svg",
        alt: "Global Solutions",
        width: 150,
        height: 50,
        href: "https://example.com",
      },
    ],
  },
};

export const NoGrayscale: Story = {
  args: {
    title: "",
    subtitle: "",
    grayscale: false,
    logos: [
      {
        src: "/logos/logo1.svg",
        alt: "Company 1",
        width: 130,
        height: 45,
      },
      {
        src: "/logos/logo2.svg",
        alt: "Company 2",
        width: 130,
        height: 45,
      },
      {
        src: "/logos/logo3.svg",
        alt: "Company 3",
        width: 130,
        height: 45,
      },
      {
        src: "/logos/logo4.svg",
        alt: "Company 4",
        width: 130,
        height: 45,
      },
    ],
  },
};
