import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';
import { CARDS_GAME_STATUS } from '@shared/types';

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardBack: Story = {
  args: {
    id: 0,
    points: 0,
    gameStatus: CARDS_GAME_STATUS.CHOOSE,
    selected: false,
    onClick: () => {},
  },
};
export const CardBackSelected: Story = {
  args: {
    id: 0,
    points: 0,
    gameStatus: CARDS_GAME_STATUS.CHOOSE,
    selected: true,
    onClick: () => {},
  },
};
export const CardPositive: Story = {
  args: {
    id: 0,
    points: 100,
    gameStatus: CARDS_GAME_STATUS.REVEAL,
    selected: false,
    onClick: () => {},
  },
};
export const CardNegative: Story = {
  args: {
    id: 0,
    points: -100,
    gameStatus: CARDS_GAME_STATUS.REVEAL,
    selected: false,
    onClick: () => {},
  },
};
export const CardPositiveWithPlayers: Story = {
  args: {
    id: 0,
    points: 100,
    gameStatus: CARDS_GAME_STATUS.REVEAL,
    selected: false,
    playersMap: [
      { id: 'Id-UltraMangoGuy', nickname: 'Ultra Mango Guy' },
      { id: 'Id-FastGuy', nickname: 'Fast Guy' },
    ],
    onClick: () => {},
  },
};
export const CardNegativeWithPlayers: Story = {
  args: {
    id: 0,
    points: -100,
    gameStatus: CARDS_GAME_STATUS.REVEAL,
    selected: false,
    playersMap: [
      { id: 'Id-UltraMangoGuy', nickname: 'Ultra Mango Guy' },
      { id: 'Id-FastGuy', nickname: 'Fast Guy' },
    ],
    onClick: () => {},
  },
};
