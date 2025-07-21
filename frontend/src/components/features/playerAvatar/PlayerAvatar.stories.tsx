import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerAvatar } from './PlayerAvatar';

const meta = {
  component: PlayerAvatar,
} satisfies Meta<typeof PlayerAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Monkey: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: 200,
      isAlive: false
    },
    style: {},
    status: 'idle',
    avatar: "monkey"
  },
};

export const Robot: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: 200,
      isAlive: false
    },
    style: {},
    status: 'idle',
    avatar: "robot"
  },
};

export const Carton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: 200,
      isAlive: false
    },
    style: {},
    status: 'idle',
    avatar: "carton"
  },
};

export const Skeleton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: 200,
      isAlive: false
    },
    style: {},
    status: 'idle',
    avatar: "skeleton"
  },
};

export const Clown: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: 200,
      isAlive: false
    },
    style: {},
    status: 'idle',
    avatar: "clown"
  },
};
