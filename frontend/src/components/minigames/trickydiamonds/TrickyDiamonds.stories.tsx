import type { Meta, StoryObj } from '@storybook/react';

import { TrickyDiamonds } from './TrickyDiamonds';

const meta = {
  component: TrickyDiamonds,
} satisfies Meta<typeof TrickyDiamonds>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
