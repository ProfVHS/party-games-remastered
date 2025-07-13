import './Modal.scss';

import { motion } from 'framer-motion';
import { ClassNames } from '../../../utils.ts';
import React from 'react';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  transparentBg?: boolean;
};

export const Modal = ({ children, onClose, className, transparentBg }: ModalProps) => {
  return (
    <div className="modal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0 }}
        className="modal__backdrop"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, delay: 0.3 },
        }}
        exit={{ opacity: 0, scale: 0 }}
        className={ClassNames("modal__content", className, {"transparent-bg": transparentBg})}
      >
        {children}
      </motion.div>
    </div>
  );
};
