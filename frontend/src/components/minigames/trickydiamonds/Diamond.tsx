import './Diamond.scss';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';
import { PlayerNicknamesList } from '@components/ui/playerNicknamesList/PlayerNicknamesList.tsx';
import { ClassNames } from '@utils';
import { Icon } from '@assets/icon';
import Trophy from '@assets/textures/trophy.svg?react';
import { TRICKY_DIAMONDS_GAME_STATUS, TrickyDiamondsGameStatus } from '@shared/types';

type DiamondPlayers = {
  id: number;
  players: string[];
};

type DiamondProps = {
  diamond: DiamondPlayers;
  gameStatus: TrickyDiamondsGameStatus;
  isSelected: boolean;
  won: boolean;
  score: number;
  onSelect: (id: number) => void;
};

export const Diamond = ({ diamond, score, gameStatus, isSelected, won, onSelect }: DiamondProps) => {
  return (
    <div className="diamond" onClick={() => onSelect(diamond.id)}>
      {gameStatus === TRICKY_DIAMONDS_GAME_STATUS.REVEAL && (
        <div className={ClassNames('diamond__players', { won: won, lost: !won })}>
          {won ? (
            <div className="diamond__trophy">
              <span className="score">+{score}</span>
              <Trophy />
            </div>
          ) : (
            <Icon icon="Cross" className="diamond__cross" />
          )}
          <PlayerNicknamesList playerList={diamond.players} className={ClassNames('diamond__players-nicknames', { positive: won, negative: !won })} />
        </div>
      )}
      <span className={ClassNames('diamond__svg', { selected: isSelected && gameStatus === TRICKY_DIAMONDS_GAME_STATUS.CHOOSE })}>
        {diamond.id === 0 && <HighDiamond />}
        {diamond.id === 1 && <MediumDiamond />}
        {diamond.id === 2 && <LowDiamond />}
      </span>
      <span className="diamond__value">+{score}</span>
    </div>
  );
};
