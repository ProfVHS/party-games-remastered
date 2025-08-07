import { Lobby } from '../../features/lobby/Lobby.tsx';
import { RoomLayout } from '../../features/roomLayout/RoomLayout.tsx';
import './RoomPage.scss';
import { useEffect, useState } from 'react';
import { socket } from '../../../socket.ts';
import { useToast } from '../../../hooks/useToast.ts';
import { usePlayersStore } from '../../../stores/playersStore.ts';
import { Minigame } from '../../minigames/Minigame.tsx';
import { useSocketConnection } from '../../../hooks/useSocketConnection.ts';
import { RoomDataType, MinigameDataType } from '../../../types/BackendSharedTypes.ts';

export const RoomPage = () => {
  const { players } = usePlayersStore();
  const toast = useToast();
  const [minigameName, setMinigameName] = useState<string>('');

  useSocketConnection();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    socket.on('started_minigame', (data: { roomData: RoomDataType; minigameData: MinigameDataType }) => {
      setMinigameName(() => data.minigameData.minigameName);
    });

    return () => {
      socket.off('player_join_toast');
      socket.off('started_minigame');
    };
  }, [socket]);

  return (
    <div className="room-page">
      <div className="room-page__content">
        <RoomLayout players={players}>{minigameName !== '' ? <Minigame minigameName={minigameName} /> : <Lobby />}</RoomLayout>
      </div>
    </div>
  );
};
