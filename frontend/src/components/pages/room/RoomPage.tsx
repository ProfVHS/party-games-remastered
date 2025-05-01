import { Lobby } from '../../features/lobby/Lobby.tsx';
import { RoomLayout } from '../../features/roomLayout/RoomLayout.tsx';
import './RoomPage.scss';
import { useEffect } from 'react';
import { socket } from '../../../socket.ts';
import { useToast } from '../../../hooks/useToast.ts';
import { usePlayersStore } from '../../../stores/playersStore.ts';

export const RoomPage = () => {
  const { players, fetchPlayers } = usePlayersStore();
  const toast = useToast();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });
  }, [socket]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="room-page">
      <div className="room-page__content">
        <RoomLayout players={players}>
          <Lobby />
        </RoomLayout>
      </div>
    </div>
  );
};
