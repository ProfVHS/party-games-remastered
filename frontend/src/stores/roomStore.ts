import { create } from 'zustand';
import { socket } from '@socket';
import { RoomDataType, GameStateType } from '@shared/types';
import { RoomSettingsType } from '@shared/types/RoomSettingsType.ts';

type RoomStoreProps = {
  roomData: RoomDataType | null;
  setRoomData: (newRoomData: RoomDataType) => void;
  updateRoomSettings: (newSettings: RoomSettingsType) => void;
  updateRoomGameState: (newGameState: GameStateType) => void;
  fetchRoomData: () => void;
};

export const useRoomStore = create<RoomStoreProps>((set) => ({
  roomData: null,
  setRoomData: (newRoomData: RoomDataType) => {
    set({ roomData: newRoomData });
  },
  updateRoomSettings: (newSettings: RoomSettingsType) => {
    set((state) => {
      if (!state.roomData) return state;

      return {
        roomData: {
          ...state.roomData,
          settings: newSettings,
        },
      };
    });
  },
  updateRoomGameState: (newGameState: GameStateType) => {
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
  fetchRoomData: () => {
    socket.emit('get_room_data', (newRoomData: RoomDataType) => {
      set({ roomData: newRoomData });
    });
  },
}));
