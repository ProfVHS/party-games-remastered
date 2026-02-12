import { PointerEvent } from 'react';
import { MinigameNamesEnum } from '@shared/types';
import { ClassNames } from '@utils';
import { Icon } from '@assets/icon';
import { Button } from '@components/ui/button/Button.tsx';

import './MinigameItem.scss';
import { MinigameEntryType } from '@shared/types/RoomSettingsType.ts';

type MinigameItemProps = {
  minigame: MinigameEntryType;
  type: 'add' | 'remove';
  onClick?: (minigame: MinigameEntryType) => void;
  onDrag?: (e: PointerEvent<HTMLDivElement>) => void;
  isHost?: boolean;
};

export const MinigameItem = ({ minigame, type, onClick, onDrag, isHost }: MinigameItemProps) => {
  return (
    <div className={ClassNames('minigame-item', { draggable: !!onDrag })}>
      <div className="minigame-item__icon" onPointerDown={(e) => onDrag && onDrag(e)}>
        {minigame.name === MinigameNamesEnum.clickTheBomb && <Icon icon="ClickTheBomb" />}
        {minigame.name === MinigameNamesEnum.cards && <Icon icon="Cards" />}
        {/*{minigame.name === MinigameNamesEnum.colorsMemory && <Icon icon="ColorsMemory" />}*/}
        {/*{minigame.name === MinigameNamesEnum.trickyDiamonds && <Icon icon="TrickyDiamonds" />}*/}
      </div>
      <div className="minigame-item__content">
        <span>{minigame.name}</span>
        {isHost && (
          <Button onClick={() => onClick && onClick(minigame)} variant="round" color={{ remove: type === 'remove' }} size="small">
            {type}
          </Button>
        )}
      </div>
    </div>
  );
};
