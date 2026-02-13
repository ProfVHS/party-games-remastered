import type { Meta, StoryObj } from '@storybook/react-vite';

import { Scoreboard } from './Scoreboard.tsx';

const meta = {
  component: Scoreboard,
} satisfies Meta<typeof Scoreboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scoreboard1: Story = {
  args: {
    scoreboardPlayers: [],
  },
};
