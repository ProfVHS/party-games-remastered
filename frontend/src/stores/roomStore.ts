import { create } from 'zustand';
import { defaultRoomData, defaultRoomSettings } from '@shared/constants/defaults.ts';
import { RoomSettingsType } from '@frontend-types/RoomSettingsType.ts';
import { socket } from '@socket';
import { RoomDataType } from '@shared/types';

type RoomStoreProps = {
  roomSettings: RoomSettingsType;
  roomData: RoomDataType;
  setRoomSettings: (roomSettings: RoomSettingsType) => void;
  fetchRoomSettings: () => void;
  fetchRoomData: () => void;
};

export const useRoomStore = create<RoomStoreProps>((set) => ({
  roomSettings: defaultRoomSettings,
  roomData: defaultRoomData,
  setRoomSettings: (roomSettings: RoomSettingsType) => {
    set({ roomSettings });
  },
  fetchRoomSettings: () => {
    socket.emit('get_room_settings');
    socket.on('got_room_settings', (roomSettings: RoomSettingsType) => set({ roomSettings }));
  },
  fetchRoomData: () => {
    socket.emit('get_room_data');
    socket.on('got_room_data', (roomData: RoomDataType) => set({ roomData }));
  },
}));
