import './RoomPage.scss';
import { RoomSettings } from '@components/features/roomSettings/RoomSettings.tsx';
import { Lobby } from '@components/features/lobby/Lobby.tsx';
import PlayerAvatar from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';
import { Minigame } from '@components/minigames/Minigame.tsx';
import { RoomLayout } from '@components/features/roomLayout/RoomLayout.tsx';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomSocket } from '@sockets/roomSocket.ts';
import { useState } from 'react';
import { AvatarPicker } from '@components/features/avatarPicker/AvatarPicker.tsx';

export const RoomPage = () => {
  const { minigame, tutorialsEnabled, slots, areRoomSettingsUpToDate, setAreRoomSettingsUpToDate } = useRoomSocket();
  const players = usePlayersStore((state) => state.players);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  return minigame ? (
    <RoomLayout players={players}>
      {minigame ? <Minigame key={minigame.id} minigameName={minigame.name} tutorialsEnabled={tutorialsEnabled} /> : <></>}
    </RoomLayout>
  ) : (
    <div className="lobby-page">
      <div className="lobby-page__content">
        <RoomSettings setAreRoomSettingsUpToDate={setAreRoomSettingsUpToDate} />
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
  );
};
