import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerStatusEnum, PlayerType } from '@shared/types';

import { Scoreboard } from './Scoreboard.tsx';

const meta = {
  component: Scoreboard,
} satisfies Meta<typeof Scoreboard>;

export default meta;

type Story = StoryObj<typeof meta>;

const players: PlayerType[] = [
  {
    id: 'p1',
    nickname: 'ShadowFox',
    isAlive: true,
    score: 1200,
    isHost: false,
    isDisconnected: false,
    status: PlayerStatusEnum.happy,
    selectedObjectId: 3,
    avatar: 'avatar1.png',
  },
  {
    id: 'p2',
    nickname: 'LunaStorm',
    isAlive: true,
    score: 850,
    isHost: true,
    isDisconnected: false,
    status: PlayerStatusEnum.idle,
    selectedObjectId: 1,
    avatar: 'avatar2.png',
  },
  {
    id: 'p3',
    nickname: 'IronWolfasdfasdfasdsdf',
    isAlive: false,
    score: 640,
    isHost: false,
    isDisconnected: false,
    status: PlayerStatusEnum.dead,
    selectedObjectId: 0,
    avatar: 'avatar3.png',
  },
  {
    id: 'p4',
    nickname: 'PixelMagePixelMagePixelMage',
    isAlive: true,
    score: 430,
    isHost: false,
    isDisconnected: true,
    status: PlayerStatusEnum.sleeping,
    selectedObjectId: 5,
    avatar: 'avatar4.png',
  },
  {
    id: 'p5',
    nickname: 'RapidRaccoonasdfasfasdd',
    isAlive: true,
    score: -1020,
    isHost: false,
    isDisconnected: false,
    status: PlayerStatusEnum.happy,
    selectedObjectId: 2,
    avatar: 'avatar5.png',
  },
];

export const Scoreboard1: Story = {
  args: {
    scoreboardPlayers: players,
  },
};
