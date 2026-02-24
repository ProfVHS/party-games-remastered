import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardBack: Story = {
  args: {
    id: 0,
    points: 0,
    isFlipping: false,
    selected: false,
    onClick: () => {},
  },
};
export const CardBackSelected: Story = {
  args: {
    id: 0,
    points: 0,
    isFlipping: false,
    selected: true,
    onClick: () => {},
  },
};
export const CardPositive: Story = {
  args: {
    id: 0,
    points: 100,
    isFlipping: true,
    selected: false,
    onClick: () => {},
  },
};
export const CardNegative: Story = {
  args: {
    id: 0,
    points: -100,
    isFlipping: true,
    selected: false,
    onClick: () => {},
  },
};
