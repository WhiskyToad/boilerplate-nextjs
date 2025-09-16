import type { Meta, StoryObj } from '@storybook/nextjs'
import { OnboardingProvider } from './OnboardingProvider'
import { OnboardingTrigger } from './OnboardingTrigger'

const meta: Meta<typeof OnboardingTrigger> = {
  title: 'Components/Onboarding/OnboardingTrigger',
  component: OnboardingTrigger,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <div className="min-h-screen bg-base-100 p-4">
          <Story />
        </div>
      </OnboardingProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OnboardingTrigger>

export const ButtonVariant: Story = {
  args: {
    variant: 'button',
    showResetOption: false,
  },
}

export const ButtonWithReset: Story = {
  args: {
    variant: 'button',
    showResetOption: true,
  },
}

export const BannerVariant: Story = {
  args: {
    variant: 'banner',
    showResetOption: false,
  },
}

export const FloatingVariant: Story = {
  args: {
    variant: 'floating',
    showResetOption: true,
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <div className="min-h-screen bg-base-100 relative">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sample Dashboard</h1>
            <p className="text-base-content/70 mb-4">
              This is a sample dashboard view. The floating onboarding trigger should appear in the bottom-right corner.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Widget 1</h3>
                <p className="text-sm text-base-content/70">Sample widget content</p>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Widget 2</h3>
                <p className="text-sm text-base-content/70">Sample widget content</p>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Widget 3</h3>
                <p className="text-sm text-base-content/70">Sample widget content</p>
              </div>
            </div>
          </div>
          <Story />
        </div>
      </OnboardingProvider>
    ),
  ],
}

export const WithTourSteps: Story = {
  args: {
    variant: 'button',
    showResetOption: false,
    tourSteps: [
      {
        target: '.sample-widget-1',
        title: 'Your Dashboard',
        content: 'This is your main dashboard where you can see all your important information.',
        position: 'bottom',
      },
      {
        target: '.sample-widget-2', 
        title: 'Analytics',
        content: 'View your analytics and track your progress here.',
        position: 'top',
      },
      {
        target: '.sample-widget-3',
        title: 'Settings',
        content: 'Customize your experience in the settings panel.',
        position: 'left',
      },
    ],
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <div className="min-h-screen bg-base-100 p-4">
          <div className="mb-6">
            <Story />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-200 p-4 rounded-lg sample-widget-1">
              <h3 className="font-semibold mb-2">Dashboard Widget</h3>
              <p className="text-sm text-base-content/70">This widget will be highlighted in the tour</p>
            </div>
            <div className="bg-base-200 p-4 rounded-lg sample-widget-2">
              <h3 className="font-semibold mb-2">Analytics Widget</h3>
              <p className="text-sm text-base-content/70">This widget will be highlighted in the tour</p>
            </div>
            <div className="bg-base-200 p-4 rounded-lg sample-widget-3">
              <h3 className="font-semibold mb-2">Settings Widget</h3>
              <p className="text-sm text-base-content/70">This widget will be highlighted in the tour</p>
            </div>
          </div>
        </div>
      </OnboardingProvider>
    ),
  ],
}