import './PlayerAvatar.scss';
import { PlayerType } from '@shared/types';
import { avatarList } from './avatarList';
import React, { createElement } from 'react';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style?: React.CSSProperties;
  inLobby?: boolean;
};

export const PlayerAvatar = ({ player, style, inLobby = false }: PlayerAvatarProps) => {
  const avatar = player.avatar as avatars
  return (
    <div className="player-avatar" style={style}>
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className="player-avatar__avatar">{avatarList[avatar] && createElement(avatarList[avatar][player.status])}</div>
      {!inLobby && (
        <h2 className="player-avatar__score">Score: {player.score}</h2>
      )}
    </div>
  );
};
