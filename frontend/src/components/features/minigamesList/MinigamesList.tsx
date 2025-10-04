import { useState } from 'react';
import './MinigamesList.scss';
import { Reorder } from 'framer-motion';
import { Button } from '@components/ui/button/Button.tsx';
import { MinigameListItemType } from '@frontend-types/index';
import { MinigameNamesEnum } from '@shared/types';
import { MinigameItem } from '@components/features/minigamesList/MinigameItem';
import { DraggableMinigameItem } from '@components/features/minigamesList/DraggableMinigameItem';

type MinigamesListProps = {
  onCancel: () => void;
  onSave: (Minigames: MinigameListItemType[]) => void;
  minigames: MinigameListItemType[];
  isHost?: boolean;
};

export const MinigamesList = ({ onCancel, onSave, minigames, isHost }: MinigamesListProps) => {
  const [newMinigameList, setNewMinigameList] = useState<MinigameListItemType[]>(minigames! || []);
  const minigameList = isHost ? newMinigameList : minigames;

  const handleSave = () => {
    onSave && onSave(newMinigameList);
    onCancel && onCancel();
  };

  const addMinigameToList = (minigame: MinigameListItemType) => {
    const id = `${minigame.name}-${newMinigameList.length}`;
    setNewMinigameList((prevMinigames) => [...prevMinigames, { ...minigame, id }]);
  };

  const removeMinigameFromList = (minigame: MinigameListItemType) => {
    setNewMinigameList((prevMinigamesList) => prevMinigamesList.filter((m) => m.id !== minigame.id));
  };

  return (
    <div className="minigames-list">
      <div className="minigames-list__table">
        <span className="minigames-list__title">Minigames</span>
        {Object.values(MinigameNamesEnum).map((name) => (
          <MinigameItem minigame={{ name }} onClick={addMinigameToList} type="add" isHost={isHost} />
        ))}
      </div>
      <div className="minigames-list__table">
        <span className="minigames-list__title">Your minigames queue</span>
        <Reorder.Group
          axis="y"
          values={minigameList}
          onReorder={setNewMinigameList}
          className="minigames-list__list"
          style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {minigameList.map((minigame) =>
            isHost ? (
              <DraggableMinigameItem key={minigame.id} minigame={minigame} onClick={removeMinigameFromList} isHost={isHost} />
            ) : (
              <MinigameItem minigame={minigame} type="remove" />
            ),
          )}
        </Reorder.Group>
      </div>
      <div className="minigames-list__footer">
        {isHost ? (
          <>
            <Button style={{ width: '30%' }} onClick={handleSave}>
              Save
            </Button>
            <Button style={{ width: '30%' }} onClick={onCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button style={{ width: '30%' }} onClick={onCancel}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};
