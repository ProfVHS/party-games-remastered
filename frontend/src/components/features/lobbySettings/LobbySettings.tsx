import './LobbySettings.scss';
import { useState } from 'react';
import { Button } from '@components/ui/button/Button';
import { AnimatePresence } from 'framer-motion';
import { LobbySettingsType, MinigameEntryType } from '@frontend-types/index';
import { NumberPicker } from '@components/ui/numberPicker/NumberPicker.tsx';
import { Switch } from '@components/ui/switch/Switch.tsx';
import { Modal } from '@components/ui/modal/Modal.tsx';
import { MinigamesList } from '@components/features/minigamesList/MinigamesList.tsx';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { Badge } from '@components/ui/badge/Badge.tsx';

type LobbySettingsProps = {
  setLobbySettings: (settings: LobbySettingsType) => void;
  lobbySettings: LobbySettingsType;
}

export const LobbySettings = ({ setLobbySettings, lobbySettings }: LobbySettingsProps) => {
  const [minigamesModal, setMinigamesModal] = useState(false);
  const [newLobbySettings, setNewLobbySettings] = useState<LobbySettingsType>(lobbySettings);
  const { currentPlayer } = usePlayersStore();

  const toast = useToast();

  const handleSave = () => {
    if (!newLobbySettings.isRandomMinigames) {
      if (newLobbySettings.minigames === null || newLobbySettings.minigames!.length < 2) {
        toast.error({
          message: 'Please select at least two minigame',
          duration: 5
        });
        return;
      }
    }
    setLobbySettings(newLobbySettings);
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Room Settings</span>

      <div className="lobby-settings__option">
        <span>Random Minigames?</span>
        {currentPlayer?.isHost === "true" ? (
          <Switch defaultIsChecked={newLobbySettings.isRandomMinigames}
                  onChange={(value) => setNewLobbySettings({ ...newLobbySettings, isRandomMinigames: value })} />
        ) : (
          <Badge color={newLobbySettings.isRandomMinigames ? 'primary' : 'red'}>
            {newLobbySettings.isRandomMinigames ? 'Enabled' : 'Disabled'}
          </Badge>
        )}
      </div>

      <div className="lobby-settings__separator" />

      {newLobbySettings.isRandomMinigames ? (
        <div className="lobby-settings__option">
          <span>Number of Minigames</span>
          <NumberPicker
            defaultNumber={newLobbySettings.numberOfMinigames || 2}
            min={2}
            max={25}
            onchange={(value) => setNewLobbySettings({ ...newLobbySettings, numberOfMinigames: value })}
          />
        </div>
      ) : (
        <div className="lobby-settings__option">
          <span>Minigames</span>
          <Button color="primary" size="small" onClick={() => setMinigamesModal(true)}>
            Open List
          </Button>
        </div>
      )}

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__option">
        <span>Tutorials before minigame?</span>
        {currentPlayer?.isHost === "true" ? (
          <Switch defaultIsChecked={newLobbySettings.isTutorialsEnabled}
                  onChange={(value) => setNewLobbySettings({ ...newLobbySettings, isTutorialsEnabled: value })} />
        ) : (
          <Badge color={newLobbySettings.isTutorialsEnabled ? 'primary' : 'red'}>
            {newLobbySettings.isTutorialsEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        )}

      </div>

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__option">
        <Button style={{ width: '100%' }} size="small" onClick={handleSave}>
          Save
        </Button>
        <Button style={{ width: '100%' }} size="small">
          Cancel
        </Button>
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)} transparentBg>
            <MinigamesList
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: MinigameEntryType[]) => setNewLobbySettings({ ...newLobbySettings, minigames })}
              minigames={newLobbySettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
