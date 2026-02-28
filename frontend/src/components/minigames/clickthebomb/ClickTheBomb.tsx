import './ClickTheBomb.scss';
import { Button } from '@components/ui/button/Button.tsx';
import C4 from '@assets/textures/C4.svg?react';
import { RandomScoreBox } from './RandomScoreBox';
import { TurnNotification } from '@components/features/turnNotification/TurnNotification.tsx';
import { PrizePoolEffect } from '@components/minigames/clickthebomb/PrizePoolEffect.tsx';
import Explosion from '@components/minigames/clickthebomb/Explosion.tsx';
import { Timer } from '@components/features/timer/Timer.tsx';
import { useClickTheBombSocket } from '@sockets/clickTheBombSocket.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useGameStore } from '@stores/gameStore.ts';
import { memo } from 'react';
import { ClassNames } from '@utils';
import { useRoomStore } from '@stores/roomStore.ts';
import { GameStateType } from '@shared/types';

export const ClickTheBomb = () => {
  const { bombClick, nextTurn, gameState, canSkipTurn, exploded, scoreData } = useClickTheBombSocket();
  const roomData = useRoomStore((state) => state.roomData);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const isMyTurn = useGameStore((state) => state.isMyTurn);
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);

  return (
    <>
      <TurnNotification />
      <div className="click-the-bomb">
        <RandomScoreBox id={scoreData.id} score={scoreData.score} />
        <div className="click-the-bomb__info">
          <span className="click-the-bomb__title">Click The Bomb</span>
          <span className="click-the-bomb__turn">
            <div className="click-the-bomb__turn--nickname">{currentTurn?.nickname}</div>
            <div>Turn</div>
          </span>
        </div>
        <div
          className={ClassNames('click-the-bomb__bomb', {
            lock: !isMyTurn || !currentPlayer?.isAlive || !roomData || roomData.gameState !== GameStateType.Minigame,
            active: isMyTurn && currentPlayer?.isAlive,
          })}
          onClick={bombClick}
        >
          <Bomb />
          <span className="click-the-bomb__counter">{gameState.clickCount! >= 10 ? gameState.clickCount : '0' + gameState.clickCount}</span>
          <Timer className="click-the-bomb__timer" />
        </div>
        <Button className="click-the-bomb__button" type="button" size="medium" isDisabled={!canSkipTurn || !currentPlayer?.isAlive} onClick={nextTurn}>
          Next
        </Button>
        <div className="click-the-bomb__prize">
          <div className="click-the-bomb__prize__text">Prize Pool:</div>
          <PrizePoolEffect points={gameState.prizePool} playerExploded={exploded} />
        </div>
        {exploded && (
          <div className="click-the-bomb__explode">
            <Explosion />
          </div>
        )}
      </div>
    </>
  );
};

const Bomb = memo(() => <C4 />);
