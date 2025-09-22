import './RoomLayout.scss';
import { PlayerType } from '@shared/types';
import { PlayerAvatar } from '@components/features/playerAvatar/PlayerAvatar';
import { possibleAvatarLayouts } from '@utils';

type RoomLayoutProps = {
  players: PlayerType[];
  children: React.ReactNode;
};

export const RoomLayout = ({ players, children }: RoomLayoutProps) => {
  const numberOfPlayers = players.length;
  if (numberOfPlayers < 1) return null;

  const renderPlayers = () => {
    const relevantGridPositions = possibleAvatarLayouts[players.length];
    return players.map((player, index) => {
      const { row, col } = relevantGridPositions[index];

      return <PlayerAvatar key={index} player={player} style={{ gridColumn: col, gridRow: row }}
                           avatar='monkey' status='idle' />;
    });
  };

  return (
    <div className="room-layout">
      <div className="room-layout__lobby-form">{children}</div>
      {renderPlayers()}
    </div>
  );
};
