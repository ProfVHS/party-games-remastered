import './RoomLayout.scss';
import { Player } from '../../../types/index';
import { PlayerAvatar } from '../playerAvatar/PlayerAvatar';
import { possibleAvatarLayouts } from '../../../utils';

type RoomLayoutProps = {
  players: Player[];
  children: React.ReactNode;
};

export const RoomLayout = ({ players, children }: RoomLayoutProps) => {
  const numberOfPlayers = players.length;
  if (numberOfPlayers < 1) return null;

  const renderPlayers = () => {
    const relevantGridPositions = possibleAvatarLayouts[players.length];
    return players.map((player, index) => {
      const { row, col } = relevantGridPositions[index];

      return <PlayerAvatar key={index} player={player} style={{ gridColumn: col, gridRow: row }} />;
    });
  };

  return (
    <div className="room-layout">
      <div className="room-layout__lobby-form">{children}</div>
      {renderPlayers()}
    </div>
  );
};
