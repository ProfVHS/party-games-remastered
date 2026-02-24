import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tutorial } from './Tutorial';
import { MinigameNamesEnum } from '@shared/types';

const meta = {
  component: Tutorial,
} satisfies Meta<typeof Tutorial>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClickTheBomb: Story = {
  args: { minigameName: MinigameNamesEnum.CLICK_THE_BOMB },
};

export const Cards: Story = {
  args: { minigameName: MinigameNamesEnum.CARDS },
};

export const TrickyDiamonds: Story = {
  args: { minigameName: MinigameNamesEnum.TRICKY_DIAMONDS },
};
