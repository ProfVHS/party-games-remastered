import './PlayerNicknamesList.scss';
import { PlayerType } from '@shared/types';
import { ClassNames } from '@utils';

type PlayerNicknamesListProps = {
  playerList: PlayerType[] | string[];
  playerBackground: string;
};

export const PlayerNicknamesList = ({ playerList, playerBackground }: PlayerNicknamesListProps) => {
  return (
    <div className="player-nicknames-list">
      {playerList.map((player, index) => (
        <div key={index} className={ClassNames('player-nicknames-list__item', [playerBackground])} style={{ backgroundColor: playerBackground }}>
          {typeof player === 'string' ? player : player.nickname}
        </div>
      ))}
    </div>
  );
};
