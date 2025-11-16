import './Tutorial.scss';
import { useState } from 'react';
import { MinigameNamesEnum } from '@shared/types';
import { Button } from '@components/ui/button/Button.tsx';
import { Pagination } from '@components/features/tutorials/Pagination.tsx';
import { Text } from '@components/features/tutorials/Text.tsx';
import { ClickTheBombTutorial } from '@components/features/tutorials/minigamesTutorials/clickTheBomb.tsx';

const maxPagesByGame: Record<MinigameNamesEnum, number> = {
  [MinigameNamesEnum.clickTheBomb]: 3,
  [MinigameNamesEnum.colorsMemory]: 2,
  [MinigameNamesEnum.cards]: 4,
};

type TutorialProps = {
  minigameName: MinigameNamesEnum;
};

export const Tutorial = ({ minigameName }: TutorialProps) => {
  const [page, setPage] = useState(1);
  const maxPage = maxPagesByGame[minigameName];

  const handleChangePage = (delta: number) => {
    if (page + delta < 1 || page + delta > maxPage) return;

    setPage((prev) => prev + delta);
  };

  return (
    <div className="tutorial__overlay">
      <div className="tutorial">
        <Text variant="title">How To Play?</Text>
        <div className="tutorial__content">
          {minigameName === MinigameNamesEnum.clickTheBomb && <ClickTheBombTutorial page={page} />}
          {minigameName === MinigameNamesEnum.cards && <div></div>}
        </div>
        <Pagination page={page} maxPages={maxPage} onClick={handleChangePage} />
      </div>
      <div className="tutorial__ready">
        <Button>Ready</Button>
      </div>
    </div>
  );
};
