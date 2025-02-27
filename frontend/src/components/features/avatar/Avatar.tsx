import './Avatar.scss';
import { Player } from '../../../types/index';

type AvatarProps = {
  mapIndex: number;
  player: Player;
  numberOfPlayers: number;
};

export default function Avatar({ mapIndex, player, numberOfPlayers }: AvatarProps) {
  const avatarPositionsSet = avatarPositions[numberOfPlayers - 1];

  return (
    <div key={mapIndex} className={`player-avatar ${avatarPositionsSet[mapIndex].style}`}>
      <h2 className="player-avatar__username">{player.name}</h2>
      <img className="player-avatar__image" src="https://placehold.co/316x190" alt="Player Avatar" />
      <h2 className="player-avatar__score">Score: {player.score}</h2>
    </div>
  );
}

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
