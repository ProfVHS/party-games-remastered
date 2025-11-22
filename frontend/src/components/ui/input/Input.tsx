import { UseFormRegisterReturn } from 'react-hook-form';
import { ClassNames } from '@utils';
import './Input.scss';

type InputProps = {
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'number';
  id?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  onChange?: (value: string) => void;
  maxLength?: number;
};

export const Input = ({ className, style, type, id, placeholder, register, maxLength }: InputProps) => {
  return (
    <input
      className={ClassNames('input', className)}
      style={style}
      type={type}
      id={id}
      maxLength={maxLength}
      placeholder={placeholder}
      {...register}
      autoComplete="off"
    />
  );
};
