import { Indicator } from '@components/ui/indicator/Indicator.tsx';
import './TurnNotification.scss';
import { useTurn } from '@hooks/useTurn.ts';
import { motion } from 'framer-motion';

export const TurnNotification = () => {
  const { isMyTurn } = useTurn();

  return (
    isMyTurn && (
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
