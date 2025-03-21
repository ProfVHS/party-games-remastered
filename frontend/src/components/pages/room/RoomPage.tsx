import { Lobby } from '../../features/lobby/Lobby.tsx';
import { RoomLayout } from '../../features/roomLayout/RoomLayout.tsx';
import { Player } from '../../../types/index.ts';
import './RoomPage.scss';

// TODO: remove upon implementing functionality of fetching real players
const MockPlayersArr: Player[] = [
  { name: 'Player 1', score: 0 },
  { name: 'Player 2', score: 0 },
  { name: 'Player 3', score: 0 },
  { name: 'Player 4', score: 0 },
];

export const RoomPage = () => {
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
