import './DynamicAvatars.scss';
import { Player } from '../../../types/index';

type DynamicAvatarProps = {
  players: Player[];
  children: React.ReactNode;
};

const DynamicAvatars = ({ players, children }: DynamicAvatarProps) => {
  if (players.length < 1) return null;

  const renderPlayer = () => {
    const avatarPositionsIndex = players.length - 1;
    const avatarPositionsArray = avatarPositions[avatarPositionsIndex];
    return players.map((player, index) => (
      <div key={index} className={`player-avatar ${avatarPositionsArray[index].style}`}>
        <h2 className="player-avatar__username">{player.name}</h2>
        <img className="player-avatar__image" src="https://placehold.co/316x190" alt="Player Avatar" />
        <h2 className="player-avatar__score">Score: {player.score}</h2>
      </div>
    ));
  };

  return (
    <div className="lobby-container">
      <div className="lobby-container__lobby-form">{children}</div>
      {renderPlayer()}
    </div>
  );
};

export default DynamicAvatars;

const avatarPositions = [
  [{ style: 'pos-top' }],
  [{ style: 'pos-left' }, { style: 'pos-right' }],
  [{ style: 'pos-top-left' }, { style: 'pos-top' }, { style: 'pos-top-right' }],
  [{ style: 'pos-top-left' }, { style: 'pos-top-right' }, { style: 'pos-bottom-left' }, { style: 'pos-bottom-right' }],
  [{ style: 'pos-left' }, { style: 'pos-top-left' }, { style: 'pos-top' }, { style: 'pos-top-right' }, { style: 'pos-right' }],
  [
    { style: 'pos-top-left' },
    { style: 'pos-top' },
    { style: 'pos-top-right' },
    { style: 'pos-bottom-left' },
    { style: 'pos-bottom' },
    { style: 'pos-bottom-right' },
  ],
  [
    { style: 'pos-top-left' },
    { style: 'pos-top' },
    { style: 'pos-top-right' },
    { style: 'pos-left' },
    { style: 'pos-bottom-left' },
    { style: 'pos-bottom' },
    { style: 'pos-bottom-right' },
  ],
  [
    { style: 'pos-top-left' },
    { style: 'pos-top' },
    { style: 'pos-top-right' },
    { style: 'pos-left' },
    { style: 'pos-right' },
    { style: 'pos-bottom-left' },
    { style: 'pos-bottom' },
    { style: 'pos-bottom-right' },
  ],
];
