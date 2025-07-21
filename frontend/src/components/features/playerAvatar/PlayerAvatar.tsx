import './PlayerAvatar.scss';
import { PlayerType } from '../../../types';
import { avatarList } from './avatarList';
import React, { createElement } from 'react';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style: React.CSSProperties;
  avatar: avatars;
  status: 'idle' | 'happy' | 'dead' | 'sleeping';
};

export const PlayerAvatar = ({ player, style, avatar = 'monkey', status = 'idle' }: PlayerAvatarProps) => {
  return (
    <div className="player-avatar" style={style}>
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className="player-avatar__avatar">
        {avatarList[avatar] && createElement(avatarList[avatar][status])}
      </div>
      <h2 className="player-avatar__score">Score: {player.score}</h2>
    </div>
  );
};
