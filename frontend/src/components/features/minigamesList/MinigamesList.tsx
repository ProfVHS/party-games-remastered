import { useState } from 'react';
import './MinigamesList.scss';
import { Reorder } from 'framer-motion';
import { Button } from '../../ui/button/Button.tsx';
import { TMinigameData, EPossibleMinigames } from '../../../types';
import classNames from 'classnames';
import { Icon } from '../../../assets/icon';
import { clickTheBombConfig } from '../../../minigamesConfig.ts';

type MinigamesListProps = {
  onCancel: () => void;
  onSave: (Minigames: TMinigameData[]) => void;
  minigames?: TMinigameData[];
};

export const MinigamesList = ({ onCancel, onSave, minigames }: MinigamesListProps) => {
  const [minigamesList, setMinigamesList] = useState<TMinigameData[]>(minigames! || []);

  const handleSave = () => {
    onSave && onSave(minigamesList);
    onCancel && onCancel();
  };

  return (
    <div className="minigames-list">
      <div className="minigames-list__table">
        <span className="minigames-list__title">Minigames</span>
        <MinigameItem minigame={clickTheBombConfig} type="add" />
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
            <Reorder.Item key={minigame.minigame} value={minigame} style={{ listStyle: 'none', padding: '0', marginBottom: '8px' }}>
              <MinigameItem minigame={minigame} type="remove" />
            </Reorder.Item>
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

type MinigameItemProps = {
  minigame: TMinigameData;
  type: 'add' | 'remove';
  onClick?: (minigame: TMinigameData) => void;
};

const MinigameItem = ({ minigame, type, onClick }: MinigameItemProps) => {
  return (
    <div className={classNames('minigames-list__minigame', { draggable: type == 'remove' })}>
      <div className="minigames-list__minigame-icon">{minigame.minigame === EPossibleMinigames.clickTheBomb && <Icon icon="Bomb" />}</div>
      <div className="minigames-list__minigame-content">
        <span>{minigame.minigame}</span>
        <Button onClick={() => onClick && onClick(minigame)} variant="round" color={`${type === 'remove' ? 'remove' : 'primary'}`} size="small">
          {type}
        </Button>
      </div>
    </div>
  );
};
