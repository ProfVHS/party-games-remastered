import React from 'react';
import './Button.scss';
import { ClassNames } from '../../../utils.ts';

type ButtonColors = 'primary' | 'remove';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'square' | 'round';
  color?: ButtonColors | { [K in ButtonColors]?: boolean };
  size?: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
};

export const Button = ({
  children,
  className,
  onClick,
  style,
  type = 'button',
  variant = 'square',
  color = 'primary',
  size = 'medium',
  isDisabled = false,
}: ButtonProps) => {
  let buttonColor;

  if (typeof color === 'string') {
    buttonColor = color;
  } else {
    buttonColor = Object.entries(color).find(([_, value]) => value);
    buttonColor = buttonColor ? buttonColor[0] : 'primary';
  }

  return (
    <button className={ClassNames('button', [variant, buttonColor, size], className)} type={type} style={style} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
};
