import './Card.scss';
import { useEffect, useState } from 'react';
import { Icon } from '@assets/icon';
import { ClassNames } from '@utils';
import { usePlayersStore } from '@stores/playersStore.ts';
import { PlayerNicknamesList } from '@components/ui/playerNicknamesList/PlayerNicknamesList.tsx';
import { CARDS_GAME_STATUS, CardsGameStatus } from '@shared/types';

interface CardProps {
  id: number;
  points: number;
  gameStatus: CardsGameStatus;
  selected: boolean;
  playersMap?: { id: string; nickname: string }[];
  onClick: (id: number) => void;
}

export const Card = ({ id, points, gameStatus, selected, playersMap, onClick }: CardProps) => {
  const revealTime: number = 400;
  const pointsToDisplay: string = points < 0 ? points.toString() : '+' + points.toString();
  const [cardType, setCardType] = useState<'back' | 'positive' | 'negative'>('back');
  const [flip, setFlip] = useState<boolean>(false);
  const updatePlayerScore = usePlayersStore((state) => state.updatePlayerScore);

  const showCardBack = () => {
    setFlip(true);

    setTimeout(() => {
      setFlip(false);
      setCardType('back');
    }, revealTime);
  };

  const showCardFront = () => {
    setTimeout(
      () => {
        setFlip(true);

        setTimeout(() => {
          setFlip(false);
          setCardType(points > 0 ? 'positive' : 'negative');

          if (playersMap && playersMap.length > 0) {
            const score = points > 0 ? points / playersMap.length : points * playersMap.length;

            playersMap.forEach((player) => {
              updatePlayerScore(player.id, score);
            });
          }
        }, revealTime);
      },
      revealTime * (id + 1),
    );
  };

  useEffect(() => {
    if (gameStatus === CARDS_GAME_STATUS.CHOOSE) {
      showCardBack();
    }
    if (gameStatus === CARDS_GAME_STATUS.REVEAL) {
      showCardFront();
    }
  }, [gameStatus]);

  return (
    <div className={ClassNames('card', [cardType], { flip: flip, selected: selected })} onClick={cardType === 'back' ? () => onClick(id) : undefined}>
      {cardType !== 'back' && playersMap && playersMap.length > 0 && (
        <PlayerNicknamesList
          playerList={playersMap.map((player) => player.nickname)}
          className={ClassNames('card__players-nicknames', { positive: points > 0, negative: points < 0 })}
        />
      )}
      {cardType !== 'back' && <div className="card__score card__score--top">{pointsToDisplay}</div>}
      <div className={ClassNames('', { positive: cardType === 'positive', negative: cardType === 'negative' })}>
        {cardType === 'back' && <Icon icon="Logo" className="svg" />}
        {cardType === 'positive' && <div className="card__score card__score--mid">{pointsToDisplay}</div>}
        {cardType === 'negative' && <Icon icon="Mine" className="svg" />}
      </div>
      {cardType !== 'back' && <div className="card__score card__score--bottom">{pointsToDisplay}</div>}
    </div>
  );
};
