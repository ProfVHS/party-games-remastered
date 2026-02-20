import type { StoryObj } from '@storybook/react-vite';

import { EndGame } from './EndGame.tsx';

const meta = {
  component: EndGame,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EndGameStory: Story = {};
