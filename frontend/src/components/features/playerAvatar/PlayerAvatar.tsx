import './PlayerAvatar.scss';
import { PlayerStatusEnum, PlayerType } from '@shared/types';
import { avatarList } from './avatarList';
import React, { createElement, memo } from 'react';
import { Counter } from '@components/ui/counter/Counter.tsx';
import { ClassNames } from '@utils';
import { useTurnStore } from '@stores/turnStore.ts';
import Default from '@assets/avatars/default.svg?react';
import { socket } from '@socket';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style?: React.CSSProperties;
  inLobby?: boolean;
  ready?: boolean;
  onClick?: () => void;
};

const PlayerAvatar = ({ player, style, inLobby = false, ready, onClick }: PlayerAvatarProps) => {
  const avatar = player.avatar as avatars;
  const currentTurn = useTurnStore((state) => state.currentTurn);

  const handleChooseAvatar = () => player.id === socket.id && onClick && onClick();

  return (
    <div className={ClassNames('player-avatar', { 'has-turn': currentTurn?.id === player.id })} style={style}>
      {inLobby && <span className={ClassNames('player-avatar__status', { ready: ready })}>{ready}</span>}
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className={ClassNames('player-avatar__avatar', { lobby: socket.id === player.id && inLobby })} onClick={handleChooseAvatar}>
        {player.avatar !== 'default' ? <Avatar avatar={avatar} status={player.status} /> : <Default className="player-avatar__avatar__default" />}
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
