import type { Meta, StoryObj } from '@storybook/nextjs'
import { OnboardingProvider } from './OnboardingProvider'
import { OnboardingModal } from './OnboardingModal'
import { WelcomeStep } from './steps/WelcomeStep'
import { ProfileSetupStep } from './steps/ProfileSetupStep'
import { FeatureTourStep } from './steps/FeatureTourStep'
import { CompletionStep } from './steps/CompletionStep'

const meta: Meta<typeof OnboardingModal> = {
  title: 'Components/Onboarding/OnboardingModal',
  component: OnboardingModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <div className="min-h-screen bg-base-100">
          <Story />
        </div>
      </OnboardingProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OnboardingModal>

// Mock onboarding steps
const mockSteps = [
  {
    id: 'welcome',
    title: 'Welcome to the Platform',
    description: 'Let\'s get you started with a quick tour',
    component: WelcomeStep,
    isRequired: false,
    canSkip: true,
  },
  {
    id: 'profile',
    title: 'Set up your profile',
    description: 'Complete your profile information',
    component: ProfileSetupStep,
    isRequired: true,
    canSkip: false,
  },
  {
    id: 'features',
    title: 'Explore features',
    description: 'Learn about key platform features',
    component: FeatureTourStep,
    isRequired: false,
    canSkip: true,
  },
  {
    id: 'completion',
    title: 'All done!',
    description: 'You\'re ready to get started',
    component: CompletionStep,
    isRequired: false,
    canSkip: false,
  },
]

export const Default: Story = {
  args: {
    showProgress: true,
    allowClose: true,
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <div className="min-h-screen bg-base-100">
          <button 
            className="btn btn-primary m-4"
            onClick={() => {
              // This would trigger onboarding in a real app
              console.log('Start onboarding')
            }}
          >
            Start Onboarding
          </button>
          <Story />
        </div>
      </OnboardingProvider>
    ),
  ],
}

export const WithoutProgress: Story = {
  args: {
    showProgress: false,
    allowClose: true,
  },
}

export const NoCloseButton: Story = {
  args: {
    showProgress: true,
    allowClose: false,
  },
}

export const CustomStyling: Story = {
  args: {
    showProgress: true,
    allowClose: true,
    className: 'border-2 border-primary',
  },
}