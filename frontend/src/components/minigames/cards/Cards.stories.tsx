import type { Meta, StoryObj } from '@storybook/react';

import { Cards } from './Cards';

const meta = {
  component: Cards,
} satisfies Meta<typeof Cards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
