import './Cards.scss';

interface CardProps {
  id: number;
  points: number; // number
  isPositive: boolean;
  isRevealed: boolean;
  onClick: (id: number) => void;
}

export const Card = ({ id, points, isPositive, isRevealed, onClick }: CardProps) => {
  return (
    <div className={`card ${!isRevealed ? 'back' : isPositive ? 'positive' : 'negative'}`} onClick={!isRevealed ? () => onClick(id) : undefined}>
      {isRevealed && points}
    </div>
  );
};
