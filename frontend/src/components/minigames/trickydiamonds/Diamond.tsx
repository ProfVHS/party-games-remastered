import { WinCard } from '@components/minigames/trickydiamonds/WinCard.tsx';
import { LossCard } from '@components/minigames/trickydiamonds/LossCard.tsx';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';

type DiamondPlayers = {
  id: number;
  players: string[];
};

type DiamondProps = {
  diamond: DiamondPlayers;
  reveal: boolean;
  isSelected: boolean;
  won: boolean;
  score: number;
  onSelect: (id: number) => void;
};

export const Diamond = ({ diamond, score, reveal, isSelected, won, onSelect }: DiamondProps) => {
  return (
    <div className="tricky-diamonds__diamond" onClick={() => onSelect(diamond.id)}>
      {reveal && (
        <div className={`tricky-diamonds__players__list ${won ? 'win' : 'lost'}`}>
          {won ? <WinCard score={score} /> : <LossCard />}
          {diamond.players.map((nickname, i) => (
            // TODO: Make it global (cards also need this, perhaps future games as well)
            <div key={i} className="player">
              {nickname}
            </div>
          ))}
        </div>
      )}
      <span className={`${!reveal && isSelected ? 'selected' : ''}`}>
        {diamond.id === 0 && <HighDiamond />}
        {diamond.id === 1 && <MediumDiamond />}
        {diamond.id === 2 && <LowDiamond />}
      </span>
      <span className="tricky-diamonds__diamond__value">+{score}</span>
    </div>
  );
};
