import React from 'react';
import './Button.scss';
import classNames from 'classnames';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'square' | 'round';
  color?: 'primary' | 'remove';
  size?: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
};

export const Button = ({ children, className, onClick, style, type = 'button', variant = 'square', color = 'primary', size = 'medium', isDisabled = false }: ButtonProps) => {
  return (
    <button
      className={classNames('button', { [`button--${variant}`]: variant, [`button--${color}Color`]: color, [`button--${size}Size`]: size }, [className])}
      type={type}
      style={style}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
