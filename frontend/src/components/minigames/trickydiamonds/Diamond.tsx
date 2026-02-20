import './Diamond.scss';
import { WinCard } from '@components/minigames/trickydiamonds/WinCard.tsx';
import { LossCard } from '@components/minigames/trickydiamonds/LossCard.tsx';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';
import { PlayerNicknamesList } from '@components/ui/playerNicknamesList/PlayerNicknamesList.tsx';

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
          <PlayerNicknamesList playerList={diamond.players} playerBackground={won ? 'tricky-diamonds--positive' : 'tricky-diamonds--negative'} />
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
