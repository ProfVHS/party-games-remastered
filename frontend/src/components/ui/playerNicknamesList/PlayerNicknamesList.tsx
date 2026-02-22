import './PlayerNicknamesList.scss';
import { PlayerType } from '@shared/types';
import { ClassNames } from '@utils';

type PlayerNicknamesListProps = {
  playerList: PlayerType[] | string[];
  className?: string;
};

export const PlayerNicknamesList = ({ playerList, className }: PlayerNicknamesListProps) => {
  return (
    <div className={ClassNames('player-nicknames-list', className)}>
      {playerList.map((player, index) => (
        <div key={index} className="player-nicknames-list__item">
          {typeof player === 'string' ? player : player.nickname}
        </div>
      ))}
    </div>
  );
};
