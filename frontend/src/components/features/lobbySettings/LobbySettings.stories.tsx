import type { Meta, StoryObj } from '@storybook/react-vite';

import { LobbySettings } from './LobbySettings';

const meta = {
  component: LobbySettings,
} satisfies Meta<typeof LobbySettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {

};
