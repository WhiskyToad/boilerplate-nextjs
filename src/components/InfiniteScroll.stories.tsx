import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import InfiniteScroll from "./InfiniteScroll";

interface Item {
  id: number;
  title: string;
  description: string;
}

const meta: Meta<typeof InfiniteScroll> = {
  title: "Components/Data Display/InfiniteScroll",
  component: InfiniteScroll,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

const generateItems = (start: number, end: number): Item[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    id: start + i,
    title: `Item ${start + i}`,
    description: `Description for item ${start + i}`,
  }));
};

// Define the story with controls
export const Basic: StoryObj<typeof InfiniteScroll> = {
  render: (args) => {
    const [items, setItems] = useState<Item[]>(generateItems(1, 10));
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const newItems = generateItems(page * 10 + 1, (page + 1) * 10);
        setItems([...items, ...newItems]);
        setPage(page + 1);
        setLoading(false);
      }, 1000);
    };

    return (
      <div style={{ height: "400px", overflowY: "auto" }}>
        <InfiniteScroll
          data={items}
          isLoading={loading}
          onLoadMore={loadMore}
          hasNextPage={page < 5} // Limit to 5 pages for demo
          renderItem={(item) => (
            <div className="border p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          )}
          {...args}
        />
      </div>
    );
  },
  args: {
    emptyMessage: "No items to display",
    loadingIndicator: (
      <div className="animate-pulse">Loading more items...</div>
    ),
  },
};

// Custom styling example
export const CustomStyling: StoryObj<typeof InfiniteScroll> = {
  render: (args) => {
    const [items, setItems] = useState<Item[]>(generateItems(1, 5));
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
      setLoading(true);
      setTimeout(() => {
        const newItems = generateItems(page * 5 + 1, (page + 1) * 5);
        setItems([...items, ...newItems]);
        setPage(page + 1);
        setLoading(false);
      }, 1500);
    };

    return (
      <div style={{ height: "500px", overflowY: "auto" }}>
        <InfiniteScroll
          data={items}
          isLoading={loading}
          onLoadMore={loadMore}
          hasNextPage={page < 4}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          itemClassName="transition-all hover:scale-102"
          loadingClassName="col-span-full flex justify-center py-4"
          renderItem={(item) => (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold text-blue-800">{item.title}</h3>
              <p className="text-blue-600">{item.description}</p>
            </div>
          )}
          {...args}
        />
      </div>
    );
  },
  args: {
    emptyMessage: (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        No items available
      </div>
    ),
    loadingIndicator: (
      <div className="flex items-center">
        <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        <span>Loading more content...</span>
      </div>
    ),
  },
};
