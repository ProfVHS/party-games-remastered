import './Switch.scss';

type SwitchProps = {
  defaultIsChecked?: boolean;
  value?: boolean;
  onChange: (isChecked: boolean) => void;
};

export const Switch = ({ defaultIsChecked, onChange, value }: SwitchProps) => {
  return (
    <label className="switch">
      <input className="switch__input" type="checkbox"
             defaultChecked={defaultIsChecked || value}
             onChange={(e) => onChange && onChange(e.target.checked)}
             checked={value}
      />
      <span className="switch__track"></span>
      <span className="switch__thumb"></span>
    </label>
  );
};
