import { AlertType } from '../../../types/AlertType.ts';
import { AlertBox } from '../alertBox/AlertBox.tsx';
import './AlertContainer.scss';
import { motion } from 'framer-motion';
import { useAlert } from '../../../hooks/useAlert.ts';

type AlertContainerProps = {
  alert: AlertType | null;
}

export const AlertContainer = ({ alert }: AlertContainerProps) => {

  const _alert = useAlert();

  return (
    <div className="alert-container">
      {alert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className="alert-container__backdrop"
            onClick={_alert.hide}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3, delay: 0.3 }
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="alert-container__alert">
            <AlertBox {...alert} onClose={_alert.hide} onConfirm={() => {
              alert.onConfirm();
              _alert.hide();
            }} />
          </motion.div>
        </>
      )
      }
    </div>
  )
    ;
};
