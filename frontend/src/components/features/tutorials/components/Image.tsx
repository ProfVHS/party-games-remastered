import { ReactNode } from 'react';
import { ClassNames } from '@utils';

type ImageProps = {
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
};

export const Image = ({ children, size = 'medium' }: ImageProps) => {
  return <div className={ClassNames('tutorial__image', [size])}>{children}</div>;
};
