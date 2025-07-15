import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  component: Button,
  parameters: {
    controls: {
      exclude: ['className', 'onClick', 'style'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    size: 'medium',
    color: 'primary',
    variant: 'square',
    isDisabled: false,
    type: 'reset',
  },
  parameters: {
    theme: "light"
  }
};
