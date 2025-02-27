import './DynamicAvatars.scss';
import { Player } from '../../../types/index';
import Avatar from '../avatar/Avatar';

type DynamicAvatarsProps = {
  players: Player[];
  children: React.ReactNode;
};

const DynamicAvatars = ({ players, children }: DynamicAvatarsProps) => {
  const numberOfPlayers = players.length;
  if (numberOfPlayers < 1) return null;

  const renderPlayers = () => {
    return players.map((player, index) => <Avatar key={index} mapIndex={index} player={player} numberOfPlayers={numberOfPlayers} />);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-container__lobby-form">{children}</div>
      {renderPlayers()}
    </div>
  );
};

export default DynamicAvatars;
