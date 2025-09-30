import './RoomLayout.scss';
import { PlayerType } from '@shared/types';
import { PlayerAvatar } from '@components/features/playerAvatar/PlayerAvatar';

type RoomLayoutProps = {
  players: PlayerType[];
  children: React.ReactNode;
};

const possibleAvatarLayouts: Record<number, { row: number; col: number }[]> = {
  // All positions comments are relative to the lobby e.g. Top means Above/Top of the lobby
  1: [{ row: 1, col: 2 }], // Top
  2: [
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 }, // Right
  ],
  3: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
  ],
  4: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 3 }, // Bottom right
  ],
  5: [
    { row: 2, col: 1 }, // Left
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 3 }, // Right
  ],
  6: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
  7: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
  8: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 }, // Right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
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
