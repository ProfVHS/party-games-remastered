import './PlayerAvatar.scss';
import { PlayerType, TurnType } from '@shared/types';
import { avatarList } from './avatarList';
import React, { createElement } from 'react';
import { Counter } from '@components/ui/counter/Counter.tsx';
import { ClassNames } from '@utils';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style?: React.CSSProperties;
  inLobby?: boolean;
  currentTurn?: TurnType | null;
};

export const PlayerAvatar = ({ player, style, inLobby = false, currentTurn }: PlayerAvatarProps) => {
  const avatar = player.avatar as avatars;
  return (
    <div className={ClassNames('player-avatar', { 'has-turn': currentTurn?.player_id === player.id })} style={style}>
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className="player-avatar__avatar">{avatarList[avatar] && createElement(avatarList[avatar][player.status])}</div>
      {!inLobby && (
        <h2 className="player-avatar__score">
          Score: <Counter count={player.score} duration={1} />
        </h2>
      )}
    </div>
  );
};
