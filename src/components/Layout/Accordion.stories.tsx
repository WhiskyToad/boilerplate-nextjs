import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Layout/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Section 1",
        content: "This is the content for section 1.",
      },
      {
        id: "2",
        title: "Section 2",
        content: "This is the content for section 2.",
      },
      {
        id: "3",
        title: "Section 3",
        content: "This is the content for section 3.",
      },
    ],
  },
};

export const WithDefaultOpen: Story = {
  args: {
    ...Default.args,
    defaultOpenIndex: 0,
  },
};

export const AllowMultiple: Story = {
  args: {
    ...Default.args,
    allowMultiple: true,
  },
};

export const CustomizedAccordion: Story = {
  args: {
    items: [
      {
        id: "1",
        title: <span className="text-blue-600">Custom Title 1</span>,
        content: (
          <div className="p-4 bg-gray-100 rounded">
            Custom Content with styling
          </div>
        ),
      },
      {
        id: "2",
        title: <span className="text-green-600">Custom Title 2</span>,
        content: (
          <div className="p-4 bg-gray-100 rounded">
            More custom content here
          </div>
        ),
      },
    ],
    className: "border-2 border-blue-300",
  },
};

// For demonstrating the AccordionItem directly
export const SingleAccordionItem = () => {
  return (
    <AccordionItem
      title="Standalone Accordion Item"
      isOpen={true}
      onToggle={() => console.log("Toggled")}
      className="border border-gray-200 rounded"
    >
      <p>
        This is a standalone accordion item, not wrapped in an Accordion
        component.
      </p>
    </AccordionItem>
  );
};
