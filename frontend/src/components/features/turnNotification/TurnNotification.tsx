import { Indicator } from '@components/ui/indicator/Indicator.tsx';
import './TurnNotification.scss';
import { motion } from 'framer-motion';
import { useTurnStore } from '@stores/turnStore.ts';

export const TurnNotification = () => {
  const isMyTurn = useTurnStore((state) => state.isMyTurn);

  return (
    isMyTurn && (
      <motion.div
        className="turn-notification"
        initial={{ scale: 0, opacity: 0, x: '-50%' }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, ease: 'ease-in' }}
        style={{ zIndex: 100 }}
      >
        <Indicator message="Your Turn" />
      </motion.div>
    )
  );
};
