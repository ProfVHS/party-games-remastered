import './Podium.scss';
import { createElement } from 'react';
import { PlayerType } from '@shared/types';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';
import { ClassNames } from '@utils';

type avatars = keyof typeof avatarList;

type PodiumProps = {
  place: number;
  player: PlayerType;
};

export const Podium = ({ place, player }: PodiumProps) => {
  const avatar = player.avatar as avatars;

  const placeClass = place === 1 ? 'first' : place === 2 ? 'second' : place === 3 ? 'third' : '';
  const heights = [13, 12, 11.5, 10, 9, 9, 8, 8];
  const height = heights[place - 1] || 10;

  return (
    <div className={ClassNames('podium', [placeClass, place.toString()])} style={{ height: `${height}rem` }}>
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
