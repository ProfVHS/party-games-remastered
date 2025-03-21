import { Lobby } from '../../features/lobby/Lobby.tsx';
import './RoomPage.scss';

export const RoomPage = () => {
  return (
    <div className="room-page">
      <div className="room-page__grid">
        <div className="room-page__content">
          <Lobby />
        </div>
      </div>
    </div>
  );
};
