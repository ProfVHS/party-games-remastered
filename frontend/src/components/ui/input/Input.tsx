import { UseFormRegisterReturn } from 'react-hook-form';
import { ClassNames } from '@utils';
import './Input.scss';

type InputProps = {
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'number';
  id?: string;
  placeholder?: string;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
  register?: UseFormRegisterReturn;
};

export const Input = ({ className, style, type, id, placeholder, onPaste, register }: InputProps) => {
  return <input className={ClassNames('input', className)} style={style} type={type} id={id} placeholder={placeholder} onPaste={onPaste} {...register} />;
};
