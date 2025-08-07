import { MinigameNamesEnum, MinigameListItemType } from '../../../types';
import { ClassNames } from '../../../utils.ts';
import { Icon } from '../../../assets/icon';
import { Button } from '../../ui/button/Button.tsx';

import './MinigameItem.scss';

type MinigameItemProps = {
  minigame: MinigameListItemType;
  type: 'add' | 'remove';
  onClick?: (minigame: MinigameListItemType) => void;
  onDrag?: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const MinigameItem = ({ minigame, type, onClick, onDrag }: MinigameItemProps) => {
  return (
    <div className={ClassNames('minigame-item', { draggable: type === 'remove' })}>
      <div className="minigame-item__icon" onPointerDown={(e) => onDrag && onDrag(e)}>
        {minigame.name === MinigameNamesEnum.clickTheBomb && <Icon icon="ClickTheBomb" />}
        {minigame.name === MinigameNamesEnum.cards && <Icon icon="Cards" />}
        {minigame.name === MinigameNamesEnum.colorsMemory && <Icon icon="ColorsMemory" />}
      </div>
      <div className="minigame-item__content">
        <span>{minigame.name}</span>
        <Button onClick={() => onClick && onClick(minigame)} variant="round" color={{ remove: type === 'remove' }} size="small">
          {type}
        </Button>
      </div>
    </div>
  );
};
