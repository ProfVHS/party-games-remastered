import { useEffect, useRef } from 'react';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './ToastIcons.tsx';
import './Toast.scss';
import { motion, useAnimate } from 'framer-motion';
import { useToast } from '../../../hooks/useToast.ts';

type ToastType = {
  id: number;
  message: string;
  type: 'error' | 'info' | 'warning' | 'success';
  duration?: number;
  autoDismiss?: boolean;
};

export const Toast = ({ id, type, message, duration = 5, autoDismiss = true }: ToastType) => {
  const [scope, animate] = useAnimate();

  const timer = useRef<number | undefined>(undefined);

  const toast = useToast();

  useEffect(() => {
    animate(
      scope.current,
      { opacity: [0, 1], scale: [0, 1] },
      { type: 'spring', duration: 0.5 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    if(autoDismiss){
      timer.current = setTimeout(() => {
        exitAnimation().then(() => handleDismiss())
      }, (duration*1000) + 1000);

      return () => {
        clearTimeout(timer.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exitAnimation = async () => {
    await animate(
      scope.current,
      { opacity: [1, 0], scale: [1, 0] },
      { duration: 0.5 }
    );
  }

  const handleDismiss = () => toast.remove(id)

  return (
    <motion.div
      className={`alert alert--${type}`}
      ref={scope}
    >
      <motion.div
        className="alert__progress"
        initial={{width: '100%'}}
        animate={{width: '0%'}}
        transition={{duration, ease: 'linear'}}
      />
      <div className="alert__icon">
        {type === 'success' && <SuccessIcon width={24} height={24} />}
        {type === 'error' && <ErrorIcon width={24} height={24} />}
        {type === 'warning' && <WarningIcon width={24} height={24} />}
        {type === 'info' && <InfoIcon width={24} height={24} />}
      </div>
      <div className="alert__message">{message}</div>
    </motion.div>
  );
};
