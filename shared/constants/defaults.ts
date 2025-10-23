import { RoomDataType, RoomStatusEnum } from '../types';

export const defaultRoomSettings = {
  isRandomMinigames: true,
  isTutorialsEnabled: true,
  minigames: [],
  numberOfMinigames: 2
};

export const defaultRoomData: RoomDataType = {
  currentRound: '',
  currentTurn: '',
  maxRounds: '',
  minigameIndex: '',
  roomCode: '',
  status: RoomStatusEnum.lobby
};
