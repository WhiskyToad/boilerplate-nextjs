import type { Meta, StoryObj } from '@storybook/nextjs';
import { Accordion, SingleAccordion } from './Accordion';
import { FiUser, FiAlertCircle, FiSettings } from 'react-icons/fi';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    allowMultiple: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  {
    id: '1',
    title: 'User Account',
    badge: '3',
    content: (
      <div className="space-y-2">
        <p className="text-base-content/80">Manage your account settings and preferences.</p>
        <div className="space-y-1">
          <p className="text-sm">• Profile information</p>
          <p className="text-sm">• Security settings</p>
          <p className="text-sm">• Notification preferences</p>
        </div>
      </div>
    ),
  },
  {
    id: '2',
    title: 'Bug Reports',
    badge: '12',
    content: (
      <div className="space-y-3">
        <div className="bg-base-200 rounded p-3">
          <p className="font-medium text-sm">Login button not working</p>
          <p className="text-xs text-base-content/60">Reported 2 hours ago</p>
        </div>
        <div className="bg-base-200 rounded p-3">
          <p className="font-medium text-sm">Dashboard loading slowly</p>
          <p className="text-xs text-base-content/60">Reported 5 hours ago</p>
        </div>
      </div>
    ),
  },
  {
    id: '3',
    title: 'System Settings',
    content: (
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span className="text-sm">Enable dark mode</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span className="text-sm">Send email notifications</span>
        </label>
      </div>
    ),
  },
  {
    id: '4',
    title: 'Disabled Section',
    disabled: true,
    content: <p>This content is not accessible.</p>,
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const WithDefaultOpen: Story = {
  args: {
    items: sampleItems,
    defaultOpenItems: ['1', '2'],
  },
};

export const AllowMultiple: Story = {
  args: {
    items: sampleItems,
    allowMultiple: true,
  },
};

export const Bordered: Story = {
  args: {
    items: sampleItems,
    variant: 'bordered',
  },
};

export const Minimal: Story = {
  args: {
    items: sampleItems,
    variant: 'minimal',
  },
};

export const SmallSize: Story = {
  args: {
    items: sampleItems,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    items: sampleItems,
    size: 'lg',
  },
};

export const WithIconTitles: Story = {
  args: {
    items: [
      {
        id: '1',
        title: (
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            <span>User Management</span>
          </div>
        ),
        badge: '5',
        content: <p>User management content goes here.</p>,
      },
      {
        id: '2',
        title: (
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-error" />
            <span>Critical Issues</span>
          </div>
        ),
        badge: '2',
        content: <p>Critical issues that need immediate attention.</p>,
      },
      {
        id: '3',
        title: (
          <div className="flex items-center gap-2">
            <FiSettings className="w-4 h-4" />
            <span>Configuration</span>
          </div>
        ),
        content: <p>System configuration options.</p>,
      },
    ],
  },
};

// Single Accordion Stories
const singleMeta: Meta<typeof SingleAccordion> = {
  title: 'UI/SingleAccordion',
  component: SingleAccordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export const SingleDefault: StoryObj<typeof SingleAccordion> = {
  args: {
    title: 'Assigned Reports',
    badge: '3',
    children: (
      <div className="space-y-3">
        <div className="bg-base-200 rounded p-3">
          <p className="font-medium text-sm">Button click not working</p>
          <p className="text-xs text-base-content/60">Reported by user@example.com</p>
        </div>
        <div className="bg-base-200 rounded p-3">
          <p className="font-medium text-sm">Page loading error</p>
          <p className="text-xs text-base-content/60">Reported by another@example.com</p>
        </div>
      </div>
    ),
  },
};

export const SingleOpen: StoryObj<typeof SingleAccordion> = {
  args: {
    title: 'Bug Details',
    defaultOpen: true,
    children: (
      <div className="space-y-2">
        <p className="text-sm text-base-content/80">
          This bug affects the login functionality and needs immediate attention.
        </p>
      </div>
    ),
  },
};