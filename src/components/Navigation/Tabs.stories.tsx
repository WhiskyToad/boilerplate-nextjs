import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { useState } from "react";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";

const meta: Meta<typeof Tabs> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["bordered", "lifted", "boxed"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Interactive demo component
const TabsDemo = (args: any) => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="w-full max-w-2xl">
      <Tabs {...args} value={activeTab} onChange={setActiveTab}>
        <Tab value="home" label="Home" />
        <Tab value="profile" label="Profile" />
        <Tab value="settings" label="Settings" />
        <Tab value="disabled" label="Disabled" disabled />
      </Tabs>

      <div className="p-4 border rounded-md mt-4 min-h-[100px]">
        {activeTab === "home" && <div>Home content goes here</div>}
        {activeTab === "profile" && <div>Profile content goes here</div>}
        {activeTab === "settings" && <div>Settings content goes here</div>}
      </div>
    </div>
  );
};

// Tab component for the stories
const Tab = ({ value, label, disabled, className }: any) => (
  <div value={value} label={label} disabled={disabled} className={className} />
);

export const BorderedTabs: Story = {
  render: (args) => <TabsDemo {...args} />,
  args: {
    variant: "bordered",
    size: "md",
  },
};

export const LiftedTabs: Story = {
  render: (args) => <TabsDemo {...args} />,
  args: {
    variant: "lifted",
    size: "md",
  },
};

export const BoxedTabs: Story = {
  render: (args) => <TabsDemo {...args} />,
  args: {
    variant: "boxed",
    size: "md",
  },
};

export const WithIcons: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <div className="w-full max-w-2xl">
        <Tabs {...args} value={activeTab} onChange={setActiveTab}>
          <Tab
            value="home"
            label={
              <div className="flex items-center gap-2">
                <FiHome /> Home
              </div>
            }
          />
          <Tab
            value="profile"
            label={
              <div className="flex items-center gap-2">
                <FiUser /> Profile
              </div>
            }
          />
          <Tab
            value="settings"
            label={
              <div className="flex items-center gap-2">
                <FiSettings /> Settings
              </div>
            }
          />
        </Tabs>

        <div className="p-4 border rounded-md mt-4 min-h-[100px]">
          Content for the {activeTab} tab
        </div>
      </div>
    );
  },
  args: {
    variant: "bordered",
    size: "md",
  },
};

export const SmallTabs: Story = {
  render: (args) => <TabsDemo {...args} />,
  args: {
    variant: "bordered",
    size: "sm",
  },
};

export const LargeTabs: Story = {
  render: (args) => <TabsDemo {...args} />,
  args: {
    variant: "bordered",
    size: "lg",
  },
};
