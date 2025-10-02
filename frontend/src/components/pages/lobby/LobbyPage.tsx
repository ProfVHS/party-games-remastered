import './LobbyPage.scss';
import { LobbySettings } from '@components/features/lobbySettings/LobbySettings.tsx';
import { LobbyContent } from '@components/features/lobbyContent/LobbyContent.tsx';
import { useEffect, useState } from 'react';
import { LobbySettingsType } from '@frontend-types/LobbySettingsType.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { PlayerAvatar } from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { MAX_PLAYERS } from '@shared/constants/game.ts';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';

export const LobbyPage = () => {
  const [lobbySettings, setLobbySettings] = useState<LobbySettingsType>({
    isRandomMinigames: true,
    isTutorialsEnabled: true,
    minigames: [],
    numberOfMinigames: 2
  });
  const toast = useToast();

  useSocketConnection();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    return () => {
      socket.off('player_join_toast');
      socket.off('started_minigame');
    };
  }, [socket]);

  const { players } = usePlayersStore();

  const slots = [
    ...players,
    ...Array(MAX_PLAYERS - players.length).fill(null)
  ]

  return (
    <div className="lobby-page">
      <div className="lobby-page__content">
        <LobbySettings lobbySettings={lobbySettings} setLobbySettings={setLobbySettings} />
        <LobbyContent lobbySettings={lobbySettings} />
      </div>
      <div className="lobby-page__players">
        {slots.map((player, index) => player !== null ? (
          <PlayerAvatar key={index} player={player} status='idle' inLobby={true} />
        ) : (
          <EmptySlot />
        ))}
      </div>
    </div>
  );
};
