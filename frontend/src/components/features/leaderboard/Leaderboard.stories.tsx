import type { Meta, StoryObj } from '@storybook/react-vite';

import { Leaderboard } from './Leaderboard';

const meta = {
  component: Leaderboard,
} satisfies Meta<typeof Leaderboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LeaderboardScore: Story = {
  args: {
    leaderboardPlayers: [],
  },
};

export const LeaderboardGameScore: Story = {
  args: {
    leaderboardPlayers: [],
  },
};
