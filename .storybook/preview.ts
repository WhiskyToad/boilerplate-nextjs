import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'gray',
          value: '#f8fafc',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
      ],
    },
    docs: {
      theme: {
        base: 'light',
        colorPrimary: '#3b82f6',
        colorSecondary: '#8b5cf6',
        appBg: '#ffffff',
        appContentBg: '#ffffff',
        appBorderColor: '#e2e8f0',
        appBorderRadius: 8,
        fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontCode: 'Monaco, "Lucida Console", monospace',
        textColor: '#1f2937',
        textInverseColor: '#ffffff',
        barTextColor: '#64748b',
        barSelectedColor: '#3b82f6',
        barBg: '#ffffff',
        inputBg: '#ffffff',
        inputBorder: '#e2e8f0',
        inputTextColor: '#1f2937',
        inputBorderRadius: 6,
      },
    },
  },
};

export default preview;