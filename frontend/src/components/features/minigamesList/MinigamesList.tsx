import { useState } from 'react';
import './MinigamesList.scss';
import { Reorder } from 'framer-motion';
import { Button } from '../../ui/button/Button.tsx';
import { EPossibleMinigames, MinigameListItemType } from '../../../types';
import { MinigameItem } from './MinigameItem.tsx';
import { DraggableMinigameItem } from './DraggableMinigameItem.tsx';

type MinigamesListProps = {
  onCancel: () => void;
  onSave: (Minigames: MinigameListItemType[]) => void;
  minigames?: MinigameListItemType[];
};

export const MinigamesList = ({ onCancel, onSave, minigames }: MinigamesListProps) => {
  const [minigamesList, setMinigamesList] = useState<MinigameListItemType[]>(minigames! || []);

  const handleSave = () => {
    onSave && onSave(minigamesList);
    onCancel && onCancel();
  };

  const addMinigameToList = (minigame: MinigameListItemType) => {
    const id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
    setMinigamesList((prevMinigames) => [...prevMinigames, { ...minigame, id }]);
  };

  const removeMinigameFromList = (minigame: MinigameListItemType) => {
    setMinigamesList((prevMinigamesList) => prevMinigamesList.filter((m) => m.id !== minigame.id));
  };

  return (
    <div className="minigames-list">
      <div className="minigames-list__table">
        <span className="minigames-list__title">Minigames</span>
        <MinigameItem minigame={{ name: EPossibleMinigames.clickTheBomb }} onClick={addMinigameToList} type="add" />
      </div>
      <div className="minigames-list__table">
        <span className="minigames-list__title">Your minigames queue</span>
        <Reorder.Group
          axis="y"
          values={minigamesList}
          onReorder={setMinigamesList}
          style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {minigamesList.map((minigame) => (
            <DraggableMinigameItem key={minigame.id} minigame={minigame} onClick={removeMinigameFromList} />
          ))}
        </Reorder.Group>
      </div>
      <div className="minigames-list__footer">
        <Button style={{ width: '30%' }} onClick={handleSave}>
          Save
        </Button>
        <Button style={{ width: '30%' }} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
