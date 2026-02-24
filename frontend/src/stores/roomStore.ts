import { create } from 'zustand';
import { GameStateType, RoomDataType } from '@shared/types';
import { RoomSettingsType } from '@shared/types/RoomSettingsType.ts';

type RoomStoreProps = {
  roomData: RoomDataType | null;
  roomSettings: RoomSettingsType | null;
  setRoomData: (newRoomData: RoomDataType) => void;
  updateGameState: (newGameState: GameStateType) => void;
  updateEndAt: (newEndAt: number) => void;
  setRoomSettings: (newSettings: RoomSettingsType) => void;
};

export const useRoomStore = create<RoomStoreProps>((set) => ({
  roomData: null,
  roomSettings: null,
  setRoomData: (newRoomData: RoomDataType) => {
    set({ roomData: newRoomData });
  },
  updateGameState: (newGameState: GameStateType) => {
    set((state) => {
      if (!state.roomData) return state;

      return {
        roomData: {
          ...state.roomData,
          gameState: newGameState,
        },
      };
    });
  },
  updateEndAt: (newEndAt: number) => {
    set((state) => {
      if (!state.roomData) return state;

      return {
        roomData: {
          ...state.roomData,
          endAt: newEndAt,
        },
      };
    });
  },
  setRoomSettings: (newSettings: RoomSettingsType) => {
    set({ roomSettings: newSettings });
  },
}));
