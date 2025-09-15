import type { Meta, StoryObj } from '@storybook/nextjs'
import { Badge, StatusBadge, PriorityBadge } from '@/components/ui/badge/Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component for displaying status, categories, and labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'bug', 'feature', 'nps', 'general'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'bug',
    icon: '🐛',
    children: 'Bug Report',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="bug">Bug</Badge>
      <Badge variant="feature">Feature</Badge>
      <Badge variant="nps">NPS</Badge>
      <Badge variant="general">General</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm mb-2">Feedback Types</h4>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="bug" />
          <StatusBadge status="feature" />
          <StatusBadge status="nps" />
          <StatusBadge status="general" />
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-sm mb-2">Status</h4>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="pending" />
          <StatusBadge status="resolved" />
          <StatusBadge status="dismissed" />
        </div>
      </div>
    </div>
  ),
}

export const PriorityBadges: Story = {
  render: () => (
    <div>
      <h4 className="font-medium text-sm mb-2">Priority Levels</h4>
      <div className="flex flex-wrap gap-2">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
        <PriorityBadge priority="critical" />
      </div>
    </div>
  ),
}

export const FeedbackExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 border border-base-300 rounded-lg">
      <h4 className="font-medium text-sm mb-2">Usage in Feedback Items</h4>
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Bug Report #123</h3>
        <StatusBadge status="bug" />
        <PriorityBadge priority="high" />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Feature Request #456</h3>
        <StatusBadge status="feature" />
        <PriorityBadge priority="medium" />
        <Badge variant="outline" size="sm">In Progress</Badge>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="font-medium">NPS Survey Response</h3>
        <StatusBadge status="nps" />
        <Badge variant="general" size="sm">Score: 9</Badge>
      </div>
    </div>
  ),
}