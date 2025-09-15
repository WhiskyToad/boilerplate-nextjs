import type { Meta, StoryObj } from '@storybook/nextjs'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component for displaying content with various styles and layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    hover: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader title="Card Title" description="This is a basic card component" />
        <CardContent>
          <p>This is the main content of the card. You can put any content here including text, images, forms, or other components.</p>
        </CardContent>
        <CardFooter justify="end">
          <Button variant="ghost">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Card variant="default">
        <CardHeader title="Default Card" />
        <CardContent>Default border styling</CardContent>
      </Card>
      
      <Card variant="outlined">
        <CardHeader title="Outlined Card" />
        <CardContent>Thicker border styling</CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardHeader title="Elevated Card" />
        <CardContent>Shadow styling</CardContent>
      </Card>
      
      <Card variant="ghost" hover>
        <CardHeader title="Ghost Card (Hoverable)" />
        <CardContent>Minimal styling with hover effect</CardContent>
      </Card>
    </div>
  ),
}

export const FeedbackCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base">Bug Report #123</h3>
            <p className="text-sm text-base-content/70">Submitted 2 hours ago</p>
          </div>
          <Badge variant="bug">Bug</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">
          The submit button on the contact form is not working properly. When clicked, 
          nothing happens and no error message is shown.
        </p>
        <div className="text-xs text-base-content/60 space-y-1">
          <p><strong>Browser:</strong> Chrome 91.0.4472.124</p>
          <p><strong>URL:</strong> /contact</p>
          <p><strong>User:</strong> john.doe@example.com</p>
        </div>
      </CardContent>
      <CardFooter justify="between">
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">View Details</Button>
          <Button size="sm" variant="ghost">Assign</Button>
        </div>
        <Button size="sm">Mark Resolved</Button>
      </CardFooter>
    </Card>
  ),
}

export const UserProfile: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-medium">JD</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-base-content/70">john.doe@example.com</p>
          </div>
          <Badge variant="general">Pro</Badge>
        </div>
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Joined</span>
            <span>Jan 2024</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-base-content/70">Feedback Submitted</span>
            <span>23</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}