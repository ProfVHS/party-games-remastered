import './Indicator.scss';
import { ClassNames } from '@utils';

type Indicator = {
  className?: string;
  message: string;
};

export const Indicator = ({ message, className }: Indicator) => {
  return <div className={ClassNames('indicator', className)}>{message}</div>;
};
