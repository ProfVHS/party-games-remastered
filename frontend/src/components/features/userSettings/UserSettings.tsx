import { Modal } from '../../ui/modal/Modal.tsx';
import { Switch } from '../../ui/switch/Switch.tsx';
import { useState } from 'react';
import { Row } from '../../ui/row/Row.tsx';

import './UserSettings.scss';

type UserSettingsProps = {
  onClose: () => void;
};
export const UserSettings = ({ onClose }: UserSettingsProps) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Modal onClose={onClose} className="user-settings">
      <h2>User Settings</h2>
      <div className="user-settings__content">
        <Row align="center" gap={10}>
          <span>Dark mode: </span>
          <Switch defaultIsChecked={darkMode} onChange={() => setDarkMode((prev) => !prev)} />
        </Row>
        <Row align="center" gap={10}>
          <span>Volume:</span>
        </Row>
      </div>
    </Modal>
  );
};
