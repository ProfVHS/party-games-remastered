import './Badge.scss';
import { ClassNames } from '@utils';

type BadgeProps = {
  children?: React.ReactNode;
  color?: 'primary' | 'red' | 'green';
};
export const Badge = ({ children, color }: BadgeProps) => {
  return <div className={ClassNames('badge', [color])}>{children}</div>;
};
