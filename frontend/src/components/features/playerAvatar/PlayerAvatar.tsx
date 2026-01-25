import './PlayerAvatar.scss';
import { PlayerStatusEnum, PlayerType } from '@shared/types';
import { avatarList } from './avatarList';
import React, { createElement, memo } from 'react';
import { Counter } from '@components/ui/counter/Counter.tsx';
import { ClassNames } from '@utils';
import { useTurnStore } from '@stores/turnStore.ts';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style?: React.CSSProperties;
  inLobby?: boolean;
  ready?: boolean;
};

const PlayerAvatar = ({ player, style, inLobby = false, ready }: PlayerAvatarProps) => {
  const avatar = player.avatar as avatars;
  const currentTurn = useTurnStore((state) => state.currentTurn);

  return (
    <div className={ClassNames('player-avatar', { 'has-turn': currentTurn?.id === player.id })} style={style}>
      {inLobby && <span className={ClassNames('player-avatar__status', { ready: ready })}>{ready}</span>}
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className="player-avatar__avatar">
        <Avatar avatar={avatar} status={player.status} />
      </div>
      {!inLobby && (
        <h2 className="player-avatar__score">
          Score: <Counter count={player.score} duration={1} />
        </h2>
      )}
    </div>
  );
};

export default memo(PlayerAvatar);

type renderAvatarProps = {
  avatar: avatars;
  status: PlayerStatusEnum;
};

const Avatar = memo(({ avatar, status }: renderAvatarProps) => {
  return avatarList[avatar] && createElement(avatarList[avatar][status]);
});
