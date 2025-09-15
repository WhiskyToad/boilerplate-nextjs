import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Tabs } from './Tabs';
import { FiHome, FiUser, FiSettings, FiMail, FiAlertCircle } from 'react-icons/fi';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const TabsWrapper = ({ variant = 'default', size = 'md', items = [] }: any) => {
  const [activeTab, setActiveTab] = useState(items[0]?.id || '');
  
  return (
    <div className="space-y-4">
      <Tabs
        items={items}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant={variant}
        size={size}
      />
      <div className="p-4 bg-base-200 rounded-lg">
        <p className="text-sm text-base-content/60">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>
    </div>
  );
};

const basicItems = [
  { id: 'home', label: 'Home', icon: <FiHome /> },
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

const itemsWithBadges = [
  { id: 'inbox', label: 'Inbox', icon: <FiMail />, badge: '12' },
  { id: 'notifications', label: 'Notifications', icon: <FiAlertCircle />, badge: '3' },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

const enhancedItems = [
  {
    id: 'bugs',
    label: 'Bug Tracker',
    icon: <FiAlertCircle />,
    badge: '5'
  },
  {
    id: 'reports',
    label: 'User Reports',
    icon: <FiUser />,
    badge: '12'
  }
];

const itemsWithDisabled = [
  { id: 'home', label: 'Home', icon: <FiHome /> },
  { id: 'profile', label: 'Profile', icon: <FiUser />, disabled: true },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

export const Default: Story = {
  render: () => <TabsWrapper items={basicItems} />,
};

export const WithBadges: Story = {
  render: () => <TabsWrapper items={itemsWithBadges} />,
};

export const Enhanced: Story = {
  render: () => <TabsWrapper variant="enhanced" items={enhancedItems} />,
};

export const SmallSize: Story = {
  render: () => <TabsWrapper size="sm" items={basicItems} />,
};

export const LargeSize: Story = {
  render: () => <TabsWrapper size="lg" items={basicItems} />,
};

export const EnhancedLarge: Story = {
  render: () => <TabsWrapper variant="enhanced" size="lg" items={enhancedItems} />,
};

export const WithDisabled: Story = {
  render: () => <TabsWrapper items={itemsWithDisabled} />,
};

export const TextOnly: Story = {
  render: () => (
    <TabsWrapper
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'details', label: 'Details' },
        { id: 'history', label: 'History' }
      ]}
    />
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <TabsWrapper
      items={[
        { id: 'list', label: 'List View', icon: <FiHome /> },
        { id: 'grid', label: 'Grid View', icon: <FiSettings /> }
      ]}
    />
  ),
};