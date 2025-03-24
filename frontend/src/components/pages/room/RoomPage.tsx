import { Lobby } from '../../features/lobby/Lobby.tsx';
import { RoomLayout } from '../../features/roomLayout/RoomLayout.tsx';
import { Player } from '../../../types/index.ts';
import './RoomPage.scss';
import { useEffect } from 'react';
import { socket } from '../../../socket.ts';
import { useToast } from '../../../hooks/useToast.ts';

// TODO: remove upon implementing functionality of fetching real players
const MockPlayersArr: Player[] = [
  { name: 'Player 1', score: 0 },
  { name: 'Player 2', score: 0 },
  { name: 'Player 3', score: 0 },
  { name: 'Player 4', score: 0 },
];

export const RoomPage = () => {
  const toast = useToast();

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });
  }, [socket]);

  return (
    <div className="room-page">
      <div className="room-page__content">
        <RoomLayout players={MockPlayersArr}>
          <Lobby />
        </RoomLayout>
      </div>
    </div>
  );
};
