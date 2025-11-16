import './Tutorial.scss';
import { ReactNode, useState } from 'react';
import { MinigameNamesEnum } from '@shared/types';
import { ClickTheBombTutorial } from '@components/features/tutorials/minigamesTutorials/clickTheBomb.tsx';
import { ClassNames } from '@utils';
import Arrow from '@assets/textures/arrow.svg?react';

type TextProps = {
  children?: ReactNode;
  variant?: 'title' | 'normal';
  color?: 'normal' | 'highlight' | 'warning' | 'reward';
};

export const Text = ({ children, variant = 'normal', color = 'normal' }: TextProps) => {
  return <div className={ClassNames('tutorial__text', [variant, color])}>{children}</div>;
};

type ImageProps = {
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
};

export const Image = ({ children, size = 'medium' }: ImageProps) => {
  return <div className={ClassNames('tutorial__image', [size])}>{children}</div>;
};

type PaginatedProps = {
  page: number;
  maxPages: number;
};

export const Pagination = ({ page, maxPages }: PaginatedProps) => {
  return (
    <div className="tutorial__pagination">
      <div className={ClassNames('arrow', 'left', { disabled: page === 1 })}>
        <Arrow />
      </div>
      <span className="indicator">
        {page} / {maxPages}
      </span>
      <div className={ClassNames('arrow', 'right', { disabled: page === maxPages })}>
        <Arrow />
      </div>
    </div>
  );
};

type TutorialProps = {
  minigameName: MinigameNamesEnum;
};

export const Tutorial = ({ minigameName }: TutorialProps) => {
  const [page, setPage] = useState(1);

  return (
    <div className="tutorial">
      <Text variant="title">How To Play?</Text>
      <div className="tutorial__content">
        {minigameName === MinigameNamesEnum.clickTheBomb && <ClickTheBombTutorial page={page} />}
        {minigameName === MinigameNamesEnum.cards && <div></div>}
      </div>
      <Pagination page={page} maxPages={3} />
    </div>
  );
};
