import React from "react";
import { withNextRouter } from "../src/stories/decorators/withNextRouter";
import "../src/globals.css";

// Font decorator to apply font styling in Storybook
const withFonts = (Story) => (
  <div className="storybook-wrapper font-sans">
    <Story />
  </div>
);

// Combine all decorators
export const decorators = [withNextRouter, withFonts];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextjs: {
    appDirectory: true,
  },
};
