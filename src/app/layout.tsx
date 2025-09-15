import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaaS Boilerplate - Build Your Next Project Faster",
  description:
    "Production-ready Next.js SaaS boilerplate with authentication, payments, dashboards, and more. Build your MVP in days, not months.",
  keywords:
    "nextjs boilerplate, saas starter, react boilerplate, typescript, stripe integration, supabase auth, tailwind css",
  authors: [{ name: "SaaS Boilerplate" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/logo/icon.svg",
  },
  openGraph: {
    title: "SaaS Boilerplate - Build Your Next Project Faster",
    description:
      "Production-ready Next.js SaaS boilerplate with authentication, payments, dashboards, and more.",
    type: "website",
    siteName: "SaaS Boilerplate",
    images: ["/images/meta.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Boilerplate - Build Your Next Project Faster",
    description:
      "Production-ready Next.js SaaS boilerplate with authentication, payments, dashboards, and more.",
    images: ["/images/meta.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>
          <ReactQueryProvider>
            {children}
            <ToastProvider />
          </ReactQueryProvider>
        </PostHogProvider>

        {/* Boost Toad Feedback Widget */}
        <script
          src={`${
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://www.boosttoad.com"
          }/api/widget/bundle?projectId=5ea8a71e-9158-49fb-8e15-b92cdacd8cc3`}
          async
        />
        <script
          id="TrackTheMetric"
          data-website-id="c38ff7de-5916-4485-92b7-fc30a3ac18b0"
          data-domain="boosttoad.com"
          src="https://app.trackthemetric.com/tracker.js"
          defer
        ></script>
      </body>
    </html>
  );
}
