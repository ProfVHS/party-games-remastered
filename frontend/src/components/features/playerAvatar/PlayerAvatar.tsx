import './PlayerAvatar.scss';
import { Player } from '../../../types/index';

type PlayerAvatarProps = {
  player: Player;
  style: React.CSSProperties;
};

export const PlayerAvatar = ({ player, style }: PlayerAvatarProps) => {
  return (
    <div className="player-avatar" style={style}>
      <h2 className="player-avatar__username">{player.name}</h2>
      <img className="player-avatar__image" src="https://placehold.co/316x190" alt="Player Avatar" />
      <h2 className="player-avatar__score">Score: {player.score}</h2>
    </div>
  );
};
