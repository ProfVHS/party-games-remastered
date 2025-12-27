import type { StoryObj } from '@storybook/react-vite';

import { Podium } from './Podium.tsx';

const meta = {
  component: Podium,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PodiumStory: Story = {
  args: {
    place: 1,
    nickname: 'Ultra Mango Guy',
    score: 100,
  },
};
