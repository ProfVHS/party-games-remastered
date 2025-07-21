import type { Meta, StoryObj } from '@storybook/react-vite';

import { NumberPicker } from './NumberPicker';

const meta = {
  component: NumberPicker,
  parameters: {
    controls: {
      exclude: ['style', 'onchange'],
    },
  },
} satisfies Meta<typeof NumberPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 1,
    max: 10,
    defaultNumber: 2,
    onchange: () => {},
    style: {},
  },
  parameters: {
    theme: "dark"
  }
};
