import './PlayerAvatar.scss';
import { PlayerType, TurnType } from '@shared/types';
import { avatarList } from './avatarList';
import React, { createElement, useContext } from 'react';
import { Counter } from '@components/ui/counter/Counter.tsx';
import { ClassNames } from '@utils';
import Default from '@assets/avatars/default.svg?react';
import { AvatarPickerContext } from '@context/avatarPicker/AvatarPickerContext.ts';
import { socket } from '@socket';

type avatars = keyof typeof avatarList;

type PlayerAvatarProps = {
  player: PlayerType;
  style?: React.CSSProperties;
  inLobby?: boolean;
  currentTurn?: TurnType | null;
  ready?: boolean;
};

export const PlayerAvatar = ({ player, style, inLobby = false, currentTurn, ready }: PlayerAvatarProps) => {
  const avatar = player.avatar as avatars;
  const { setShowAvatarPicker } = useContext(AvatarPickerContext);

  const handleChooseAvatar = () => {
    if (player.id === socket.id) {
      setShowAvatarPicker(true);
    }
  };

  return (
    <div className={ClassNames('player-avatar', { 'has-turn': currentTurn?.player_id === player.id })} style={style}>
      {inLobby && <span className={ClassNames('player-avatar__status', { ready: ready })}>{ready}</span>}
      <h2 className="player-avatar__username">{player.nickname}</h2>
      <div className={ClassNames('player-avatar__avatar', { lobby: socket.id === player.id && inLobby })} onClick={handleChooseAvatar}>
        {avatarList[avatar] ? createElement(avatarList[avatar][player.status]) : <Default className="player-avatar__avatar__default" />}
      </div>
      {!inLobby && (
        <h2 className="player-avatar__score">
          Score: <Counter count={player.score} duration={1} />
        </h2>
      )}
    </div>
  );
};
