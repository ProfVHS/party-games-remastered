import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerAvatar } from './PlayerAvatar';
import { PlayerStatusEnum } from '@shared/types';

const meta = {
  component: PlayerAvatar,
} satisfies Meta<typeof PlayerAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Monkey: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: "200",
      isAlive: "false",
      id: "abc",
      isHost: "false",
      status: PlayerStatusEnum.onilne,
      selectedObjectId: "",
      avatar: "monkey"
    },
    style: {},
    status: 'idle',
  },
};

export const Robot: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: "200",
      isAlive: "false",
      id: "abc",
      isHost: "false",
      status: PlayerStatusEnum.onilne,
      selectedObjectId: "",
      avatar: "robot"
    },
    style: {},
    status: 'idle',
  },
};

export const Carton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: "200",
      isAlive: "false",
      id: "abc",
      isHost: "false",
      status: PlayerStatusEnum.onilne,
      selectedObjectId: "",
      avatar: "carton"
    },
    style: {},
    status: 'idle',
  },
};

export const Skeleton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: "200",
      isAlive: "false",
      id: "abc",
      isHost: "false",
      status: PlayerStatusEnum.onilne,
      selectedObjectId: "",
      avatar: "skeleton"
    },
    style: {},
    status: 'idle',
  },
};

export const Clown: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: "200",
      isAlive: "false",
      id: "abc",
      isHost: "false",
      status: PlayerStatusEnum.onilne,
      selectedObjectId: "",
      avatar: "clown"
    },
    style: {},
    status: 'idle',
  },
};
