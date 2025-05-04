import { Reorder, useDragControls } from 'framer-motion';
import { MinigameItem } from './MinigameItem.tsx';
import { MinigamesListItemType } from '../../../types';

type DraggableMinigameItemProps = {
  minigame: MinigamesListItemType;
  onClick?: (minigame: MinigamesListItemType) => void;
};

export const DraggableMinigameItem = ({ minigame, onClick }: DraggableMinigameItemProps) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      key={minigame.id}
      value={minigame}
      dragListener={false}
      dragControls={controls}
      style={{ listStyle: 'none', padding: '0', marginBottom: '8px' }}
    >
      <MinigameItem minigame={minigame} type="remove" onDrag={(e) => controls.start(e)} onClick={onClick} />
    </Reorder.Item>
  );
};
