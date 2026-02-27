import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerNicknamesList } from './PlayerNicknamesList';
import { ClassNames } from '@utils';

const meta = {
  component: PlayerNicknamesList,
} satisfies Meta<typeof PlayerNicknamesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardsPositive: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    className: ClassNames('card__players-nicknames', { positive: true, negative: false }),
  },
};
export const CardsNegative: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    className: ClassNames('card__players-nicknames', { positive: false, negative: true }),
  },
};
export const TrickyDiamondsPositive: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    className: ClassNames('diamond__players-nicknames', { positive: true, negative: false }),
  },
};
export const TrickyDiamondsNegative: Story = {
  args: {
    playerList: ['Player 1', 'Ultra Mango Guy'],
    className: ClassNames('diamond__players-nicknames', { positive: false, negative: true }),
  },
};
