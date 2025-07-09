import type { Meta, StoryObj } from '@storybook/react';

import { ClickTheBomb } from './ClickTheBomb';

const meta = {
  component: ClickTheBomb,
} satisfies Meta<typeof ClickTheBomb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  }
};
