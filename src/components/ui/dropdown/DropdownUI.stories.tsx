import type { Meta, StoryObj } from '@storybook/nextjs'
import { DropdownUI, DropdownOption } from './DropdownUI'

const mockOptions: DropdownOption[] = [
  {
    id: '1',
    label: 'My Awesome App',
    subtitle: 'awesome-app.com',
  },
  {
    id: '2', 
    label: 'E-commerce Site',
    subtitle: 'shop.example.com',
  },
  {
    id: '3',
    label: 'Blog Platform',
    subtitle: 'blog.example.com',
  }
]

const meta = {
  title: 'UI/DropdownUI',
  component: DropdownUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    isLoading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof DropdownUI>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: mockOptions,
    selectedOption: null,
    placeholder: 'Select an option',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: false,
    isLoading: false,
  },
}

export const WithSelection: Story = {
  args: {
    options: mockOptions,
    selectedOption: mockOptions[0],
    placeholder: 'Select an option',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: false,
    isLoading: false,
  },
}

export const Empty: Story = {
  args: {
    options: [],
    selectedOption: null,
    placeholder: 'No options available',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: false,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    options: mockOptions,
    selectedOption: null,
    placeholder: 'Loading...',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: false,
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    options: mockOptions,
    selectedOption: mockOptions[1],
    placeholder: 'Select an option',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: true,
    isLoading: false,
  },
}

export const WithoutSubtitles: Story = {
  args: {
    options: [
      { id: '1', label: 'Simple Option 1' },
      { id: '2', label: 'Simple Option 2' },
      { id: '3', label: 'Simple Option 3' },
    ],
    selectedOption: null,
    placeholder: 'Choose one',
    onSelect: (option: DropdownOption) => console.log('Selected:', option),
    disabled: false,
    isLoading: false,
  },
}