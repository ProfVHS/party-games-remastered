import { create } from 'zustand';
import { defaultRoomSettings } from '@shared/constants/defaults.ts';
import { RoomSettingsType } from '@frontend-types/RoomSettingsType.ts';
import { socket } from '@socket';

type RoomStoreProps = {
  roomSettings: RoomSettingsType;
  setRoomSettings: (roomSettings: RoomSettingsType) => void;
  fetchRoomSettings: () => void;
};

export const useRoomStore = create<RoomStoreProps>((set) => ({
  roomSettings: defaultRoomSettings,
  setRoomSettings: (roomSettings: RoomSettingsType) => {
    set({ roomSettings });
  },
  fetchRoomSettings: () => {
    socket.emit('get-room-settings');

    socket.on('got-room-settings', (roomSettings: RoomSettingsType) => set({ roomSettings }));
  },
}));
