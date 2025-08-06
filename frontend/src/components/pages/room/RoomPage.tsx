import { Lobby } from '../../features/lobby/Lobby.tsx';
import { RoomLayout } from '../../features/roomLayout/RoomLayout.tsx';
import './RoomPage.scss';
import { useEffect } from 'react';
import { socket } from '../../../socket.ts';
import { useToast } from '../../../hooks/useToast.ts';
import { usePlayersStore } from '../../../stores/playersStore.ts';
import { Minigame } from '../../minigames/Minigame.tsx';
import { useMinigameStore } from '../../../stores/gameStore.ts';
import { useSocketConnection } from '../../../hooks/useSocketConnection.ts';

export const RoomPage = () => {
  const { players } = usePlayersStore();
  const toast = useToast();
  const { minigameData } = useMinigameStore();

  useSocketConnection();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    return () => {
      socket.off('player_join_toast');
    };
  }, [socket]);

  return (
    <div className="room-page">
      <div className="room-page__content">
        <RoomLayout players={players}>{minigameData ? <Minigame minigameData={minigameData} /> : <Lobby />}</RoomLayout>
      </div>
    </div>
  );
};
