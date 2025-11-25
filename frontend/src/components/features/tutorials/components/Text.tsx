import { ReactNode } from 'react';
import { ClassNames } from '@utils';

type TextProps = {
  children?: ReactNode;
  variant?: 'title' | 'small' | 'normal' | 'large';
  color?: 'normal' | 'highlight' | 'warning' | 'reward';
};

export const Text = ({ children, variant = 'normal', color = 'normal' }: TextProps) => {
  return <span className={ClassNames('tutorial__text', [variant, color])}>{children}</span>;
};
