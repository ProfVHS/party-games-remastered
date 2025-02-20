import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from './Alert';

const meta = {
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    message: "Test Alert message, lorem ipsum",
    type: "error",
    autoDismiss: false
  }
};

export const Warning: Story = {
  args: {
    message: "Test Alert message, lorem ipsum",
    type: "warning",
    autoDismiss: false
  }
};

export const Info: Story = {
  args: {
    message: "Test Alert message, lorem ipsum",
    type: "info",
    autoDismiss: false
  }
};

export const Success: Story = {
  args: {
    message: "Test Alert message, lorem ipsum",
    type: "success",
    autoDismiss: false
  }
};
