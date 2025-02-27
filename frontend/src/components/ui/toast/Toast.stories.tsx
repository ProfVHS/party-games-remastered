import type { Meta, StoryObj } from '@storybook/react';

import { Toast } from './Toast.tsx';

const meta = {
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    id: 1,
    message: 'Test Toast message, lorem ipsum',
    type: 'error',
    autoDismiss: false,
  },
};

export const Warning: Story = {
  args: {
    id: 1,
    message: 'Test Toast message, lorem ipsum',
    type: 'warning',
    autoDismiss: false,
  },
};

export const Info: Story = {
  args: {
    id: 1,
    message: 'Test Toast message, lorem ipsum',
    type: 'info',
    autoDismiss: false,
  },
};

export const Success: Story = {
  args: {
    id: 1,
    message: 'Test Toast message, lorem ipsum',
    type: 'success',
    autoDismiss: false,
  },
};
