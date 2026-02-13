import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerNicknamesList } from './PlayerNicknamesList';

const meta = {
  component: PlayerNicknamesList,
} satisfies Meta<typeof PlayerNicknamesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardsPositive: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    playerBackground: 'cards--positive',
  },
};
export const CardsNegative: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    playerBackground: 'cards--negative',
  },
};
export const TrickyDiamondsPositive: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    playerBackground: 'tricky-diamonds--positive',
  },
};
export const TrickyDiamondsNegative: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    playerBackground: 'tricky-diamonds--negative',
  },
};
