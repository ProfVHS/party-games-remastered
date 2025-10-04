import { NumberPicker } from '@components/ui/numberPicker/NumberPicker.tsx';
import { Badge } from '@components/ui/badge/Badge.tsx';
import { Switch } from '@components/ui/switch/Switch.tsx';
import { Button } from '@components/ui/button/Button.tsx';

type SettingRow = {
  isHost: boolean;
  label: string;
  value: number | string | boolean;
  onChange: (value?: number | string | boolean) => void;
  type: 'NumberPicker' | 'Switch' | 'Button';
  text?: string;
}

export const SettingRow = ({ isHost, label, value, type, onChange, text }: SettingRow) => {

  const renderUserValue = () => {
    switch (type) {
      case 'NumberPicker':
        return (
          <span>{value}</span>
        );
      case 'Switch':
        return (
          <Badge color={value ? 'green' : 'red'}>
            {value ? 'Enabled' : 'Disabled'}
          </Badge>
        );
      case 'Button':
        if (!text) throw new Error('SettingRow with button type required text prop');
        return (
          <Button color="primary" size="small" onClick={onChange}>
            {text}
          </Button>
        )
      default:
        break;
    }
  };

  const renderHostInput = () => {
    switch (type) {
      case 'Switch':
        return <Switch value={value as boolean} onChange={onChange} />;
      case 'Button':
        if (!text) throw new Error('SettingRow with button type required text prop');
        return (
          <Button color="primary" size="small" onClick={onChange}>
            {text}
          </Button>
        )
      case 'NumberPicker':
        return (
          <NumberPicker
            value={value as number}
            defaultNumber={value as number}
            min={2}
            max={25}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <>
      <div className="lobby-settings__option">
        <span>{label}</span>
        {isHost ? renderHostInput() : renderUserValue()}
      </div>

      <div className="lobby-settings__separator" />
    </>
  );
};
