import './Cards.scss';
import { useEffect, useState } from 'react';
import { PlayerType } from '@shared/types/index';
import { usePlayersStore } from '@stores/playersStore';
import { Icon } from '@assets/icon';

// TODO:
// Responsive design
// Change card back design (image)
// Add sound effects

interface CardProps {
  id: number;
  points: number; // number
  isPositive: boolean;
  isFlipping?: boolean;
  selected?: boolean;
  newPlayersPointsCard?: PlayerType[];
  onClick: (id: number) => void;
  startNewRound?: () => void;
}

export const Card = ({ id, points, isPositive, isFlipping, selected, newPlayersPointsCard, onClick, startNewRound }: CardProps) => {
  const visibleDuration: number = 2000; // How long the cards and selected players remain visible
  const revealeTime: number = 400 * (id + 1); // Time in milliseconds to reveal the card
  const pointsToDisplay: string = points < 0 ? points.toString() : '+' + points.toString();
  const [cardType, setCardType] = useState<'back' | 'positive' | 'negative'>('back'); // 'back', 'positive', 'negative'
  const [flipping, setFlipping] = useState<boolean>(false);
  const [playerNicknamesSelectedCard, setPlayerNicknamesSelectedCard] = useState<string[]>([]);
  const { players, setPlayers } = usePlayersStore();

  const flipCardBack = () => {
    setFlipping(true);

    setTimeout(() => {
      setCardType('back');
      setPlayerNicknamesSelectedCard(() => []);
      setFlipping(false);
    }, 400);
  };

  const revealCard = () => {
    // First timeout to flip the card by 90 degrees, still with the back side visible
    setTimeout(() => {
      setFlipping(true);

      // Second timeout to change the card type after the flip animation starts and reveal the card with new points and players
      setTimeout(() => {
        setCardType(isPositive ? 'positive' : 'negative');

        if (!newPlayersPointsCard || newPlayersPointsCard.length < 0) return;

        const pointsToAdd = Math.floor(points < 0 ? points * newPlayersPointsCard.length : points / newPlayersPointsCard.length);
        let playerNicknames: string[] = [];

        // Update the score for each affected player
        newPlayersPointsCard.forEach((player) => {
          players.forEach((p) => {
            if (p.id === player.id) {
              p.score = (parseInt(p.score) + pointsToAdd).toString();
              playerNicknames = [...playerNicknames, p.nickname];
            }
          });
        });

        setPlayers([...players]);
        setFlipping(false);
        setPlayerNicknamesSelectedCard(() => playerNicknames);

        if (id === 8 && startNewRound) {
          setTimeout(() => {
            startNewRound();
          }, visibleDuration);
        }
      }, 400);
    }, revealeTime);
  };

  useEffect(() => {
    if (isFlipping) {
      revealCard();
    } else {
      flipCardBack();
    }
  }, [isFlipping]);

  return (
    <div
      className={`card ${cardType} ${flipping ? 'flipping' : ''} ${selected ? 'selected' : ''} ${playerNicknamesSelectedCard.length > 0 ? 'players' : ''}`}
      onClick={cardType === 'back' ? () => onClick(id) : undefined}
    >
      {playerNicknamesSelectedCard.length > 0 && (
        <div className="players__list">
          {playerNicknamesSelectedCard.map((nickname, index) => (
            <div key={index}>{nickname}</div>
          ))}
        </div>
      )}
      {cardType !== 'back' && <div className="card__content__top">{pointsToDisplay}</div>}
      <div className="card__content">
        {cardType === 'back' && <Icon icon="Logo" className="svg" />}
        {cardType === 'positive' && pointsToDisplay}
        {cardType === 'negative' && <Icon icon="Mine" className="svg" />}
      </div>
      {cardType !== 'back' && <div className="card__content__bottom">{pointsToDisplay}</div>}
    </div>
  );
};
