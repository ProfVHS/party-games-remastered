import { Lobby } from '../../features/lobby/Lobby.tsx';
import DynamicAvatars from '../../features/dynamicAvatars/DynamicAvatars.tsx';
import './RoomPage.scss';

export const RoomPage = () => {
  return (
    <div className="room-page">
      <div className="room-page__grid">
        <div className="room-page__content">
          <DynamicAvatars playersReady={2}>
            <Lobby />
          </DynamicAvatars>
        </div>
      </div>
    </div>
  );
};
