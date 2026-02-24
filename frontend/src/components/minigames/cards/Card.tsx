import './Card.scss';
import { useEffect, useState } from 'react';
import { Icon } from '@assets/icon';
import { ClassNames } from '@utils';
import { usePlayersStore } from '@stores/playersStore.ts';
import { PlayerNicknamesList } from '@components/ui/playerNicknamesList/PlayerNicknamesList.tsx';
import { PlayerType } from '@shared/types';

interface CardProps {
  id: number;
  points: number;
  isFlipping: boolean;
  selected: boolean;
  onClick: (id: number) => void;
}

export const Card = ({ id, points, isFlipping, selected, onClick }: CardProps) => {
  const revealTime: number = 400;
  const pointsToDisplay: string = points < 0 ? points.toString() : '+' + points.toString();
  const [cardType, setCardType] = useState<'back' | 'positive' | 'negative'>('back');
  const [flip, setFlip] = useState<boolean>(false);
  const [playersWithThisCard, setPlayersWithThisCard] = useState<PlayerType[]>([]);
  const players = usePlayersStore((state) => state.players);

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
        }, revealTime);
      },
      revealTime * (id + 1),
    );
  };

  useEffect(() => {
    if (!isFlipping) {
      showCardBack();
    } else {
      showCardFront();
    }
  }, [isFlipping]);

  useEffect(() => {
    setPlayersWithThisCard(players.filter((player) => player.selectedItem === id));
  }, [players]);

  return (
    <div className={ClassNames('card', [cardType], { flip: flip, selected: selected })} onClick={cardType === 'back' ? () => onClick(id) : undefined}>
      {cardType !== 'back' && playersWithThisCard.length > 0 && (
        <PlayerNicknamesList
          playerList={playersWithThisCard}
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
