import './LobbyPage.scss';
import { RoomSettings } from '@components/features/roomSettings/RoomSettings.tsx';
import { Dispatch, SetStateAction, useState } from 'react';
import PlayerAvatar from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';
import { AvatarPicker } from '@components/features/avatarPicker/AvatarPicker.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { Loading } from '@components/ui/loading/Loading.tsx';
import { Lobby } from '@components/features/lobby/Lobby.tsx';
import { SlotType } from '@frontend-types/SlotType.ts';

type LobbyPageProps = {
  slots: SlotType;
  areRoomSettingsUpToDate: boolean;
  setAreRoomSettingsUpToDate: Dispatch<SetStateAction<boolean>>;
};

export const LobbyPage = ({ slots, areRoomSettingsUpToDate, setAreRoomSettingsUpToDate }: LobbyPageProps) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const roomSettings = useRoomStore((state) => state.roomSettings);

  return roomSettings ? (
    <div className="lobby-page">
      <div className="lobby-page__content">
        <RoomSettings roomSettings={roomSettings} setAreRoomSettingsUpToDate={setAreRoomSettingsUpToDate} />
        <Lobby areRoomSettingsUpToDate={areRoomSettingsUpToDate} />
      </div>
      <div className="lobby-page__players">
        {slots.map((player, index) =>
          player !== null ? (
            <PlayerAvatar onClick={() => setShowAvatarPicker(true)} key={index} player={player} inLobby={true} ready={player.ready} />
          ) : (
            <EmptySlot key={index} />
          ),
        )}
      </div>
      {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} />}
    </div>
  ) : (
    <Loading />
  );
};
