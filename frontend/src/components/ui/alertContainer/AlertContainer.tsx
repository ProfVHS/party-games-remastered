import './AlertContainer.scss';
import { motion } from 'framer-motion';
import { AlertType } from '@frontend-types/index';
import { AlertBox } from '@components/ui/alertBox/AlertBox.tsx';
import { useAlert } from '@hooks/useAlert.ts';

type AlertContainerProps = {
  alert: AlertType | null;
};

export const AlertContainer = ({ alert }: AlertContainerProps) => {
  const alertHook = useAlert();

  return (
    <div className="alert-container">
      {alert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className="alert-container__backdrop"
            onClick={alertHook.hide}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3, delay: 0.3 },
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="alert-container__alert"
          >
            <AlertBox
              {...alert}
              onClose={alertHook.hide}
              onConfirm={() => {
                alert.onConfirm();
                alertHook.hide();
              }}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};
