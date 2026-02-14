import type { StoryObj } from '@storybook/react-vite';

import { Podium } from './Podium.tsx';
import { PlayerStatusEnum } from '@shared/types';

const meta = {
  component: Podium,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PodiumStory: Story = {
  args: {
    place: 1,
    player: {
      id: 'user',
      nickname: 'Ultra Mango Guy',
      isAlive: true,
      score: 300,
      isHost: false,
      ready: true,
      isDisconnected: false,
      status: PlayerStatusEnum.idle,
      selectedItem: -100,
      avatar: 'clown',
    },
  },
};
