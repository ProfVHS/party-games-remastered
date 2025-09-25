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

export const LobbySettings = () => {
  const [minigamesModal, setMinigamesModal] = useState(false);
  const [lobbySettings, setLobbySettings] = useState<LobbySettingsType>({
    isRandomMinigames: false,
    isTutorialsEnabled: false,
    minigames: [],
    numberOfMinigames: 2
  });
  const { currentPlayer } = usePlayersStore();
  const toast = useToast();

  const handleSave = () => {
    if (!lobbySettings.isRandomMinigames) {
      if (lobbySettings.minigames === null || lobbySettings.minigames!.length < 2) {
        toast.error({
          message: 'Please select at least two minigame',
          duration: 5
        });
        return;
      }
    }
    setLobbySettings(lobbySettings);
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Room Settings</span>

      <div className="lobby-settings__option">
        <span>Random Minigames?</span>
        {currentPlayer?.isHost ? (
          <Switch defaultIsChecked={lobbySettings.isRandomMinigames}
                  onChange={(value) => setLobbySettings({ ...lobbySettings, isRandomMinigames: value })} />
        ) : (
          <Badge color={lobbySettings.isRandomMinigames ? "primary" : "red"}>
            {lobbySettings.isRandomMinigames ? "Enabled" : "Disabled"}
          </Badge>
        )}
      </div>

      <div className="lobby-settings__separator" />

      {lobbySettings.isRandomMinigames ? (
        <div className="lobby-settings__option">
          <span>Number of Minigames</span>
          <NumberPicker
            defaultNumber={lobbySettings.numberOfMinigames || 2}
            min={2}
            max={25}
            onchange={(value) => setLobbySettings({ ...lobbySettings, numberOfMinigames: value })}
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
        {currentPlayer?.isHost ? (
          <Switch defaultIsChecked={lobbySettings.isTutorialsEnabled}
                  onChange={(value) => setLobbySettings({ ...lobbySettings, isTutorialsEnabled: value })} />
        ) : (
          <Badge color={lobbySettings.isTutorialsEnabled ? "primary" : "red"}>
            {lobbySettings.isTutorialsEnabled ? "Enabled" : "Disabled"}
          </Badge>
        )}

      </div>

      <div className="lobby-settings__separator"></div>

      <div className="lobby-settings__option">
        <Button style={{ width: '100%' }} size="small" onClick={handleSave}>
          Save
        </Button>
        <Button style={{ width: '100%' }} size="small" >
          Cancel
        </Button>
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)} transparentBg>
            <MinigamesList
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: MinigameEntryType[]) => setLobbySettings({ ...lobbySettings, minigames })}
              minigames={lobbySettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
