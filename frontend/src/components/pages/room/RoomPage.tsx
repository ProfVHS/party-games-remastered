import { Lobby } from '../../features/lobby/Lobby.tsx';
import DynamicAvatars from '../../features/dynamicAvatars/DynamicAvatars.tsx';
import { Player } from '../../../types/index.ts';
import './RoomPage.scss';

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
        <DynamicAvatars players={MockPlayersArr}>
          <Lobby />
        </DynamicAvatars>
      </div>
    </div>
  );
};
