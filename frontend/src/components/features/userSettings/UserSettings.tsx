import './UserSettings.scss';
import { useContext } from 'react';
import { Modal } from '@components/ui/modal/Modal.tsx';
import { Switch } from '@components/ui/switch/Switch.tsx';
import { Row } from '@components/ui/row/Row.tsx';
import { ThemeContext } from '@context/theme/ThemeContext.ts';

type UserSettingsProps = {
  onClose: () => void;
};
export const UserSettings = ({ onClose }: UserSettingsProps) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <Modal onClose={onClose} className="user-settings">
      <h2>User Settings</h2>
      <div className="user-settings__content">
        <Row align="center" gap={10}>
          <span>Dark mode: </span>
          <Switch value={darkMode} onChange={toggleDarkMode} />
        </Row>
        <Row align="center" gap={10}>
          <span>Volume:</span>
        </Row>
      </div>
    </Modal>
  );
};
