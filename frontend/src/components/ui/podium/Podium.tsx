import './Podium.scss';
import { createElement } from 'react';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';

type avatars = keyof typeof avatarList;

type PodiumProps = {
  place: number;
  player: PlayerType;
};

export const Podium = ({ place, player }: PodiumProps) => {
  const { players } = usePlayersStore();
  const avatar = player.avatar as avatars;

  const placeClass = place === 1 ? 'first' : place === 2 ? 'second' : place === 3 ? 'third' : '';
  const heights = [13, 12, 11.5, 11, 10.5, 10, 9.5, 9];
  let height = heights[place - 1] || 10;

  if (players.length < 6 && (place === 4 || place === 5)) {
    height -= 2;
  }

  return (
    <div className={`podium ${placeClass}`} style={{ height: `${height}rem` }}>
      <div className="podium__avatar">{avatarList[avatar] && createElement(avatarList[avatar][place === 1 ? 'happy' : 'idle'])}</div>
      <div className="podium__top"></div>
      <div className="podium__base">
        <span className="place">#{place}</span>
        <span className="nickname">{player.nickname}</span>
        <span className="score">
          <span className="score__number">{player.score}</span> <span className="score__text">Score</span>
        </span>
      </div>
    </div>
  );
};
