import type { Meta, StoryObj } from '@storybook/react-vite';

import { AvatarPicker } from './AvatarPicker';

const meta = {
  component: AvatarPicker,
} satisfies Meta<typeof AvatarPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Avatar_Picker: Story = {
  args: {
    onClose: () => {},
  },
};
