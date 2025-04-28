import { Jost, Outfit } from "next/font/google";

// Font configuration
export const font = Jost({ subsets: ["latin"], variable: "--font-custom" });
export const font2 = Outfit({
  subsets: ["latin"],
  variable: "--font-custom2",
  weight: "600",
});

// Helper function to get font class names
export const getFontClassNames = () => `${font.variable} ${font2.variable} font-sans`;
