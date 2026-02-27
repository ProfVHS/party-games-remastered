import './AnimationOverlay.scss';
import { useRoomStore } from '@stores/roomStore.ts';
import { useEffect, useState } from 'react';
import { GameStateType } from '@shared/types';
import { useGameStore } from '@stores/gameStore.ts';
import { ClassNames } from '@utils';
import { motion } from 'framer-motion';

export const AnimationOverlay = () => {
  const roomData = useRoomStore((state) => state.roomData);
  const GameType = useGameStore((state) => state.type);
  const round = useGameStore((state) => state.currentRound);
  const turn = useGameStore((state) => state.currentTurn);

  const [visible, setVisible] = useState(false);

  const gameState = roomData?.gameState;
  const endAt = roomData?.endAt ?? null;

  useEffect(() => {
    if (!endAt || gameState !== GameStateType.MinigameIntro) {
      setVisible(false);
      return;
    }

    const now = Date.now();

    if (now >= endAt) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, endAt - now);

    return () => clearTimeout(timeout);
  }, [gameState, endAt]);

  if (!visible) return null;

  return (
    <div className={ClassNames('animation-wrapper')}>
      <div className={ClassNames('animation-overlay', [GameType === 'TURN' && 'turn'])}>
        {GameType === 'ROUND' && <span>Round: {round}</span>}
        {GameType === 'TURN' && (
          <>
            <span>Turn:</span>
            <span className="animation-overlay__nickname">{turn!.nickname}</span>
          </>
        )}
        <motion.div className="animation-overlay__progress" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{duration: 1, ease: 'linear' }} />
      </div>
    </div>
  );
};
