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
      score: '200',
      isAlive: 'false',
      id: 'abc',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '',
      avatar: 'monkey',
    },
    style: {},
    status: 'idle',
  },
};

export const Robot: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: '200',
      isAlive: 'false',
      id: 'abc',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '',
      avatar: 'robot',
    },
    style: {},
    status: 'idle',
  },
};

export const Carton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: '200',
      isAlive: 'false',
      id: 'abc',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '',
      avatar: 'carton',
    },
    style: {},
    status: 'idle',
  },
};

export const Skeleton: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: '200',
      isAlive: 'false',
      id: 'abc',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '',
      avatar: 'skeleton',
    },
    style: {},
    status: 'idle',
  },
};

export const Clown: Story = {
  args: {
    player: {
      nickname: 'Ultra Mango Guy',
      score: '200',
      isAlive: 'false',
      id: 'abc',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '',
      avatar: 'clown',
    },
    style: {},
    status: 'idle',
  },
};
