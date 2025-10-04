import { Reorder, useDragControls } from 'framer-motion';
import { MinigameItem } from '@components/features/minigamesList/MinigameItem';
import { MinigameListItemType } from '@frontend-types/index';

type DraggableMinigameItemProps = {
  minigame: MinigameListItemType;
  onClick?: (minigame: MinigameListItemType) => void;
  isHost?: boolean;
};

export const DraggableMinigameItem = ({ minigame, onClick, isHost }: DraggableMinigameItemProps) => {
  const controls = useDragControls();
  return (
    <Reorder.Item key={minigame.id} value={minigame} dragListener={false} dragControls={controls} style={{ listStyle: 'none', padding: '0' }}>
      <MinigameItem minigame={minigame} type="remove" onDrag={(e) => controls.start(e)} onClick={onClick} isHost={isHost} />
    </Reorder.Item>
  );
};
