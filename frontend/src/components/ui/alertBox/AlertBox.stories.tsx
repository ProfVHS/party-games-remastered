import type { Meta, StoryObj } from '@storybook/react-vite';

import { AlertBox } from './AlertBox';

const meta = {
  component: AlertBox,
} satisfies Meta<typeof AlertBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'error',
    message: "Default alert message"
  },
  parameters: {
    theme: 'light'
  }
};

