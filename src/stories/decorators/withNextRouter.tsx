import React from "react";
import { action } from "@storybook/addon-actions";

// Mock Next.js router for all stories
export const withNextRouter = (Story) => {
  // Mock the Next.js router
  const mockRouter = {
    push: action("router.push"),
    replace: action("router.replace"),
    prefetch: () => Promise.resolve(),
    back: action("router.back"),
    reload: action("router.reload"),
    events: {
      on: action("router.events.on"),
      off: action("router.events.off"),
      emit: action("router.events.emit"),
    },
    isFallback: false,
    query: {},
    asPath: "/",
    pathname: "/",
  };

  // Create a context with the mock router
  const RouterContext = React.createContext(mockRouter);

  // Return the story with the mocked router context
  return (
    <RouterContext.Provider value={mockRouter}>
      <Story />
    </RouterContext.Provider>
  );
};
