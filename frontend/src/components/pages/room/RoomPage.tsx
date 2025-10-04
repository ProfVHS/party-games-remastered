import './RoomPage.scss';
import { LobbySettings } from '@components/features/lobbySettings/LobbySettings.tsx';
import { LobbyContent } from '@components/features/lobbyContent/LobbyContent.tsx';
import { useEffect, useState } from 'react';
import { RoomSettingsType } from '@frontend-types/LobbySettingsType.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { PlayerAvatar } from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';
import { MAX_PLAYERS } from '@shared/constants/gameRules.ts';
import { MinigameDataType, RoomDataType } from '@shared/types';
import { Minigame } from '@components/minigames/Minigame.tsx';
import { RoomLayout } from '@components/features/roomLayout/RoomLayout.tsx';
import { defaultLobbySettings } from '@shared/constants/defaults.ts';

export const RoomPage = () => {
  const [lobbySettings, setLobbySettings] = useState<RoomSettingsType>(defaultLobbySettings);
  const [minigameName, setMinigameName] = useState<string>('');

  const toast = useToast();

  useSocketConnection();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    socket.on('started_minigame', (data: { roomData: RoomDataType; minigameData: MinigameDataType }) => {
      setMinigameName(() => data.minigameData.minigameName);
    });

    socket.on('updated_room_settings', (lobbySettings: RoomSettingsType) => {
      console.log(lobbySettings);
      setLobbySettings(lobbySettings);
    });

    return () => {
      socket.off('player_join_toast');
      socket.off('started_minigame');
      socket.off('updated_room_settings');
    };
  }, [socket]);

  const { players } = usePlayersStore();

  const slots = [
    ...players,
    ...Array(MAX_PLAYERS - players.length).fill(null)
  ];

  return (
    minigameName ? (
      <RoomLayout players={players}>{minigameName !== '' ?
        <Minigame minigameName={minigameName} /> : <></>}</RoomLayout>
    ) : (
      <div className="lobby-page">
        <div className="lobby-page__content">
          <LobbySettings currentRoomSettings={lobbySettings} setLobbySettings={setLobbySettings} />
          <LobbyContent lobbySettings={lobbySettings} />
        </div>
        <div className="lobby-page__players">
          {slots.map((player, index) => player !== null ? (
            <PlayerAvatar key={index} player={player} inLobby={true} />
          ) : (
            <EmptySlot />
          ))}
        </div>
      </div>
    )
  );
};
