import { UseFormRegisterReturn } from 'react-hook-form';
import { ClassNames } from '../../../utils.ts';
import "./Input.scss"

type InputProps = {
  className?: string
  style?: React.CSSProperties
  type?: 'text' | 'number'
  id?: string
  placeholder?: string
  register?: UseFormRegisterReturn
}

export const Input = ({ className, style, type, id, placeholder, register }: InputProps) => {
  return (
    <input className={ClassNames("input", className)}
           style={style} type={type}
           id={id} placeholder={placeholder}
           {...register} />
  );
};
