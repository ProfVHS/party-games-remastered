import './Switch.scss';

type SwitchProps = {
  value?: boolean;
  onChange: (isChecked: boolean) => void;
};

export const Switch = ({ onChange, value }: SwitchProps) => {
  return (
    <label className="switch">
      <input className="switch__input" type="checkbox" onChange={(e) => onChange && onChange(e.target.checked)} checked={value} />
      <span className="switch__track"></span>
      <span className="switch__thumb"></span>
    </label>
  );
};
