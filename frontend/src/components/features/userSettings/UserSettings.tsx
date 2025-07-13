import { Modal } from '../../ui/modal/Modal.tsx';
import { Switch } from '../../ui/switch/Switch.tsx';
import { useContext } from 'react';
import { Row } from '../../ui/row/Row.tsx';

import './UserSettings.scss';
import { ThemeContext } from '../../../context/theme/ThemeContext.ts';

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
          <Switch defaultIsChecked={darkMode} onChange={toggleDarkMode} />
        </Row>
        <Row align="center" gap={10}>
          <span>Volume:</span>
        </Row>
      </div>
    </Modal>
  );
};
