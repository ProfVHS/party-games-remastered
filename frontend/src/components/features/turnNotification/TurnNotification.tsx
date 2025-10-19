import { Indicator } from '@components/ui/indicator/Indicator.tsx';
import './TurnNotification.scss';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useTurn } from '@hooks/useTurn.ts';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TurnType } from '@shared/types';

export const TurnNotification = () => {
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string>('');
  const { currentPlayer } = usePlayersStore();

  const handleTurnChange = (newTurn: TurnType) => {
    setCurrentTurnPlayerId(newTurn.player_id);
  };

  useTurn({
    onChangedTurn: handleTurnChange,
    onGotTurn: handleTurnChange,
  });

  return (
    currentTurnPlayerId === currentPlayer?.id && (
      <motion.div
        className="turn-notification"
        initial={{ scale: 0, opacity: 0, x: '-50%' }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, ease: 'ease-in' }}
      >
        <Indicator message="Your Turn" />
      </motion.div>
    )
  );
};
