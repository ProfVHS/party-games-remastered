import { useState } from 'react';
import { Button } from '../../ui/button/Button';
import './LobbySettings.scss';
import { AnimatePresence } from 'framer-motion';
import { AlertType, LobbySettingsType, Minigame } from '../../../types';
import { Alert } from '../../ui/alert/Alert.tsx';
import { NumberPicker } from '../../ui/numberPicker/NumberPicker.tsx';
import { Switch } from '../../ui/switch/Switch.tsx';
import { Modal } from '../../ui/modal/Modal.tsx';
import { MinigamesList } from '../minigamesList/MinigamesList.tsx';

type LobbySettingsProps = {
  onCancel: () => void;
  lobbySettings: LobbySettingsType;
  setLobbySettings: (settings: LobbySettingsType) => void;
};

export const LobbySettings = ({
                                onCancel,
                                lobbySettings,
                                setLobbySettings
                              }: LobbySettingsProps) => {
  const [minigamesModal, setMinigamesModal] = useState(false);
  const [showAlert, setShowAlert] = useState<AlertType | null>(null);

  const [newSettings, setNewSettings] =
    useState<LobbySettingsType>(lobbySettings);

  const handleSave = () => {
    if (!newSettings.isRandomMinigames) {
      if (newSettings.minigames === null || newSettings.minigames!.length < 2) {
        setShowAlert({
          message: 'Please select at least two minigame',
          type: 'error',
          duration: 5
        });
        return;
      }
    }
    setShowAlert(null);
    setLobbySettings(newSettings);
    onCancel();
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Room Settings</span>

      <div className="lobby-settings__option">
        <span>Random Minigames?</span>
        <Switch
          defaultIsChecked={newSettings.isRandomMinigames}
          onChange={(value) =>
            setNewSettings({ ...newSettings, isRandomMinigames: value })
          }
        />
      </div>

      <div className="lobby-settings__separator" />

      {newSettings.isRandomMinigames ? (
        <div className="lobby-settings__option">
          <span>Number of Minigames</span>
          <NumberPicker
            defaultNumber={lobbySettings.numberOfMinigames || 2}
            min={2}
            max={25}
            onchange={(value) =>
              setNewSettings({ ...newSettings, numberOfMinigames: value })
            }
          />
        </div>
      ) : (
        <div className="lobby-settings__option">
          <span>Minigames</span>
          <Button
            color="primary"
            size="small"
            onClick={() => setMinigamesModal(true)}
          >
            Open List
          </Button>
        </div>
      )}

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__option">
        <span>Tutorials before minigame?</span>
        <Switch
          defaultIsChecked={lobbySettings.isTutorialsEnabled}
          onChange={(value) =>
            setNewSettings({ ...newSettings, isTutorialsEnabled: value })
          }
        />
      </div>

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__option">
        <Button style={{ width: '100%' }} onClick={handleSave}>
          Save
        </Button>
        <Button style={{ width: '100%' }} onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)}>
            <MinigamesList
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: Minigame[]) =>
                setNewSettings({ ...newSettings, minigames })
              }
              minigames={newSettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
      {showAlert && <Alert {...showAlert} onClose={() => setShowAlert(null)} />}
    </div>
  );
};
