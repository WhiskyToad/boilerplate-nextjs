import type { Meta, StoryObj } from '@storybook/nextjs'
import { Input, Textarea } from '@/components/ui/input/Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input component with validation states and different sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'your@email.com',
    type: 'email',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" label="Small Input" placeholder="Small size" />
      <Input size="md" label="Medium Input" placeholder="Medium size (default)" />
      <Input size="lg" label="Large Input" placeholder="Large size" />
    </div>
  ),
}

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        label="Username"
        placeholder="Enter username"
        success="Username is available!"
        value="johndoe2024"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        error="Password must be at least 8 characters"
        value="123"
      />
      <Input
        label="Disabled Input"
        placeholder="This input is disabled"
        disabled
        value="Cannot edit this"
      />
    </div>
  ),
}

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input label="Text Input" type="text" placeholder="Text input" />
      <Input label="Email Input" type="email" placeholder="email@example.com" />
      <Input label="Password Input" type="password" placeholder="Password" />
      <Input label="Number Input" type="number" placeholder="123" />
      <Input label="Search Input" type="search" placeholder="Search..." />
    </div>
  ),
}

export const TextareaExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea
        label="Message"
        placeholder="Type your message here..."
        rows={4}
      />
      <Textarea
        label="Feedback"
        placeholder="Please provide your feedback..."
        error="Message must be at least 10 characters"
        value="Too short"
        rows={3}
      />
    </div>
  ),
}

export const FeedbackForm: Story = {
  render: () => (
    <div className="space-y-4 w-80 p-4 border border-base-300 rounded-lg">
      <h4 className="font-medium text-sm mb-2">Bug Report Form</h4>
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        required
      />
      <Input
        label="Page URL"
        type="url"
        placeholder="https://example.com/page"
      />
      <Textarea
        label="Describe the bug"
        placeholder="What happened? What did you expect to happen?"
        rows={4}
        required
      />
    </div>
  ),
}