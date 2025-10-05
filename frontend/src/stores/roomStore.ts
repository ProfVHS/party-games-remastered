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
    socket.emit('get_room_settings');

    socket.on('got_room_settings', (roomSettings: RoomSettingsType) => set({ roomSettings }));
  },
}));
