import type { Meta, StoryObj } from "@storybook/react";
import Testimonials from "./Testimonials";

const meta: Meta<typeof Testimonials> = {
  title: "Landing Page/Testimonials",
  component: Testimonials,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: {},
};

export const SingleTestimonial: Story = {
  args: {
    title: "Customer Testimonials",
    subtitle: "See what our customers are saying about their experience",
    slidesToShow: 1,
    testimonials: [
      {
        quote:
          "This platform has completely transformed how we manage our projects. The automation features alone have saved us countless hours every month.",
        author: "Alexandra Chen",
        role: "Project Manager",
        company: "Tech Innovations Ltd",
        avatarSrc: "https://i.pravatar.cc/150?img=5",
        rating: 5,
      },
      {
        quote:
          "The customer support is exceptional. Every time we've had a question or issue, the team has responded quickly and effectively.",
        author: "Michael Rodriguez",
        role: "Director of Operations",
        company: "Global Solutions Inc",
        avatarSrc: "https://i.pravatar.cc/150?img=8",
        rating: 5,
      },
      {
        quote:
          "As a small business owner, I was looking for an affordable solution that wouldn't compromise on features. This platform delivered beyond my expectations.",
        author: "Sarah Johnson",
        role: "CEO",
        company: "Bright Ideas Studio",
        avatarSrc: "https://i.pravatar.cc/150?img=9",
        rating: 4,
      },
    ],
  },
};

export const TwoColumnTestimonials: Story = {
  args: {
    title: "What Our Clients Say",
    subtitle: "Read testimonials from businesses like yours",
    slidesToShow: 2,
    testimonials: [
      {
        quote:
          "Implementation was seamless, and the platform is incredibly intuitive. We were up and running in less than a day.",
        author: "David Wilson",
        role: "CTO",
        company: "Rapid Growth Startups",
        avatarSrc: "https://i.pravatar.cc/150?img=12",
        rating: 5,
      },
      {
        quote:
          "The analytics dashboard has provided insights that helped us increase our productivity by 30% in just three months.",
        author: "Emma Davis",
        role: "Operations Manager",
        company: "Efficient Systems",
        avatarSrc: "https://i.pravatar.cc/150?img=16",
        rating: 5,
      },
      {
        quote:
          "The collaboration features make it easy for our distributed team to stay aligned and work efficiently across time zones.",
        author: "James Miller",
        role: "Team Lead",
        company: "Remote First Inc",
        avatarSrc: "https://i.pravatar.cc/150?img=17",
        rating: 4,
      },
      {
        quote:
          "We evaluated several solutions before choosing this one. The combination of features, ease of use, and value is unmatched.",
        author: "Carol Zhang",
        role: "VP of Engineering",
        company: "Tech Evaluators",
        avatarSrc: "https://i.pravatar.cc/150?img=20",
        rating: 5,
      },
    ],
  },
};

export const NoRatings: Story = {
  args: {
    title: "Customer Success Stories",
    subtitle: "Hear from the people who use our product every day",
    testimonials: [
      {
        quote:
          "This solution addressed exactly what we needed. The team understood our challenges and delivered a perfect fit for our requirements.",
        author: "Thomas Brown",
        role: "Product Owner",
        company: "Enterprise Solutions",
        avatarSrc: "https://i.pravatar.cc/150?img=50",
      },
      {
        quote:
          "The ROI was almost immediate. Within weeks, we saw substantial improvements in our key performance metrics.",
        author: "Lisa Garcia",
        role: "CFO",
        company: "Financial Metrics Corp",
        avatarSrc: "https://i.pravatar.cc/150?img=47",
      },
      {
        quote:
          "The platform grows with us. As our needs have evolved, the flexibility of the system has allowed us to adapt without changing vendors.",
        author: "Robert Johnson",
        role: "Director of Growth",
        company: "Scaling Fast Ltd",
        avatarSrc: "https://i.pravatar.cc/150?img=42",
      },
    ],
  },
};
