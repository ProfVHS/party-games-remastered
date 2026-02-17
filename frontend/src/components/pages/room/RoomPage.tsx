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
import { EndGame } from '@components/features/endGame/EndGame.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { GameStateType } from '@shared/types';
import { Loading } from '@components/ui/loading/Loading.tsx';

export const RoomPage = () => {
  const { minigame, tutorialsEnabled, slots, areRoomSettingsUpToDate, setAreRoomSettingsUpToDate } = useRoomSocket();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const players = usePlayersStore((state) => state.players);
  const roomData = useRoomStore((state) => state.roomData);

  return (
    <div>
      {roomData ? (
        <>
          {roomData.gameState === GameStateType.Lobby && (
            <div className="lobby-page">
              <div className="lobby-page__content">
                <RoomSettings roomSettings={roomData.settings} setAreRoomSettingsUpToDate={setAreRoomSettingsUpToDate} />
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
          )}
          {roomData.gameState === GameStateType.Minigame && minigame && (
            <RoomLayout players={players}>
              <Minigame key={minigame!.id} minigameName={minigame!.name} tutorialsEnabled={tutorialsEnabled} />
            </RoomLayout>
          )}
          {roomData.gameState === GameStateType.Finished && <EndGame />}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
