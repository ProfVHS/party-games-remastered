import type { Meta, StoryObj } from '@storybook/react';

import { Tutorial } from './Tutorial';
import { MinigameNamesEnum } from '@shared/types';

const meta = {
  component: Tutorial,
} satisfies Meta<typeof Tutorial>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClickTheBomb: Story = {
  args: { minigameName: MinigameNamesEnum.clickTheBomb },
};

export const Cards: Story = {
  args: { minigameName: MinigameNamesEnum.cards },
};
