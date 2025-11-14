import type { Meta, StoryObj } from '@storybook/react';

import { Tutorial } from './Tutorial';

const meta = {
  component: Tutorial,
} satisfies Meta<typeof Tutorial>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
