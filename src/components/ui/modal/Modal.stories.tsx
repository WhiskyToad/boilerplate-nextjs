import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Modal, ModalFooter } from '@/components/ui/modal/Modal'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal component with customizable sizes and behaviors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    closeOnBackdrop: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Helper component for interactive stories
interface ModalDemoProps {
  modalProps?: any
  children?: React.ReactNode
  buttonText?: string
}

const ModalDemo = ({ modalProps, children, buttonText = 'Open Modal' }: ModalDemoProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...modalProps}
      >
        {children}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => (
    <ModalDemo
      modalProps={{
        title: 'Default Modal',
        description: 'This is a default modal with medium size',
      }}
    >
      <p>This is the modal content. You can put any content here.</p>
    </ModalDemo>
  ),
}

export const WithForm: Story = {
  render: () => (
    <ModalDemo
      modalProps={{
        title: 'Contact Form',
        description: 'Fill out the form below to get in touch',
        size: 'lg',
      }}
      buttonText="Open Contact Form"
    >
      <div className="space-y-4">
        <Input label="Name" placeholder="Your name" required />
        <Input label="Email" type="email" placeholder="your@email.com" required />
        <Input label="Subject" placeholder="What is this about?" />
        <div className="space-y-1">
          <label className="text-sm font-medium text-base-content">
            Message <span className="text-error ml-1">*</span>
          </label>
          <textarea
            className="flex w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm"
            rows={4}
            placeholder="Your message..."
          />
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Send Message</Button>
      </ModalFooter>
    </ModalDemo>
  ),
}

export const Confirmation: Story = {
  render: () => (
    <ModalDemo
      modalProps={{
        title: 'Confirm Delete',
        description: 'Are you sure you want to delete this item? This action cannot be undone.',
        size: 'sm',
      }}
      buttonText="Delete Item"
    >
      <ModalFooter justify="end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </ModalFooter>
    </ModalDemo>
  ),
}

export const NoHeader: Story = {
  render: () => (
    <ModalDemo
      modalProps={{
        showCloseButton: false,
      }}
      buttonText="Open Modal (No Header)"
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Success!</h3>
        <p className="text-base-content/70">Your action was completed successfully.</p>
        <Button className="w-full">Continue</Button>
      </div>
    </ModalDemo>
  ),
}

export const LargeContent: Story = {
  render: () => (
    <ModalDemo
      modalProps={{
        title: 'Terms of Service',
        description: 'Please read our terms carefully',
        size: 'xl',
      }}
      buttonText="View Terms"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h4 className="font-semibold">1. Acceptance of Terms</h4>
        <p className="text-sm text-base-content/80">
          By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        
        <h4 className="font-semibold">2. Use License</h4>
        <p className="text-sm text-base-content/80">
          Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
        </p>

        <h4 className="font-semibold">3. Disclaimer</h4>
        <p className="text-sm text-base-content/80">
          The materials on our website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
        </p>

        <h4 className="font-semibold">4. Limitations</h4>
        <p className="text-sm text-base-content/80">
          In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption).
        </p>
      </div>
      <ModalFooter>
        <Button variant="ghost">Decline</Button>
        <Button>Accept Terms</Button>
      </ModalFooter>
    </ModalDemo>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ModalDemo
        modalProps={{ title: 'Small Modal', size: 'sm' }}
        buttonText="Small"
      >
        <p>Small modal content</p>
      </ModalDemo>
      
      <ModalDemo
        modalProps={{ title: 'Medium Modal', size: 'md' }}
        buttonText="Medium"
      >
        <p>Medium modal content</p>
      </ModalDemo>
      
      <ModalDemo
        modalProps={{ title: 'Large Modal', size: 'lg' }}
        buttonText="Large"
      >
        <p>Large modal content with more space for detailed information and forms.</p>
      </ModalDemo>
      
      <ModalDemo
        modalProps={{ title: 'Extra Large Modal', size: 'xl' }}
        buttonText="Extra Large"
      >
        <p>Extra large modal with even more space for complex layouts and detailed content.</p>
      </ModalDemo>
    </div>
  ),
}