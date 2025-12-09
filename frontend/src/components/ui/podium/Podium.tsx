import './Podium.scss';
import { usePlayersStore } from '@stores/playersStore.ts';

type PodiumProps = {
  place: number;
  nickname: string;
  score: number;
};

export const Podium = ({ place, nickname, score }: PodiumProps) => {
  const { players } = usePlayersStore();
  const placeClass = place === 1 ? 'first' : place === 2 ? 'second' : place === 3 ? 'third' : '';
  const heights = [13, 12, 11.5, 11, 10.5, 10, 9.5, 9];
  let height = heights[place - 1] || 10;

  if (players.length < 6 && (place === 4 || place === 5)) {
    height -= 2;
  }

  return (
    <div className={`podium ${placeClass}`} style={{ height: `${height}rem` }}>
      <div className="podium__top"></div>
      <div className="podium__base">
        <span className="place">#{place}</span>
        <span className="nickname">{nickname}</span>
        <span className="score">
          <span className="score__number">{score}</span> <span className="score__text">Score</span>
        </span>
      </div>
    </div>
  );
};
