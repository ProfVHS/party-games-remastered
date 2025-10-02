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
import * as _ from 'lodash';
import { Icon } from '@assets/icon';

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

  const resetLobbySettings = () => {
    setNewLobbySettings(lobbySettings);
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Room Settings</span>

      <div className="lobby-settings__option">
        <span>Random Minigames?</span>
        {currentPlayer?.isHost === 'true' ? (
          <Switch value={newLobbySettings.isRandomMinigames}
                  onChange={(value) => setNewLobbySettings(prev => ({ ...prev, isRandomMinigames: value }))} />
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
            value={newLobbySettings.numberOfMinigames}
            min={2}
            max={25}
            onchange={(value) => setNewLobbySettings(prev => ({ ...prev, numberOfMinigames: value }))}
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
        {currentPlayer?.isHost === 'true' ? (
          <Switch value={newLobbySettings.isTutorialsEnabled}
                  onChange={(value) => setNewLobbySettings(prev => ({ ...prev, isTutorialsEnabled: value }))} />
        ) : (
          <Badge color={newLobbySettings.isTutorialsEnabled ? 'primary' : 'red'}>
            {newLobbySettings.isTutorialsEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        )}

      </div>

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__buttons">
        {!_.isEqual(lobbySettings, newLobbySettings) && (
          <>
            <Button variant="icon" size="small" onClick={handleSave}>
              <Icon icon="Save" />
            </Button>
            <Button variant="icon" size="small" color="remove" onClick={resetLobbySettings}>
              <Icon icon="Trash" />
            </Button>
          </>
        )}
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)} transparentBg>
            <MinigamesList
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: MinigameEntryType[]) => setNewLobbySettings(prev => ({ ...prev, minigames }))}
              minigames={newLobbySettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
