import { Text, Image } from '@components/features/tutorials/Tutorial.tsx';
import Bomb from '@assets/tutorials/Bomb.svg?react';
import { Button } from '@components/ui/button/Button.tsx';

const PageOne = () => {
  return (
    <>
      <Text>You have to click the bomb at least once before passing the turn to the next player</Text>
      <Image size="medium">
        <Bomb />
      </Image>
      <Text>Be quick! You’ve got 10 seconds per move</Text>
    </>
  );
};

const PageTwo = () => {
  return (
    <>
      <Text>With every click, the prize pool increases. Every next click adds even more!</Text>
      <Text>15 → 17 → 20 → 23 → 26 → 30 → 35</Text>
      <Text>Pass the turn to the next player to claim the prize pool.</Text>
      <Button>Next</Button>
    </>
  );
};

const PageThree = () => {
  return (
    <>
      <Text>Boom! The bomb explodes — the prize pool is gone, and you lose 50 points!</Text>
      <Image size="medium">
        <Bomb />
      </Image>
      <Text>The game lasts until one player remains.</Text>
    </>
  );
};

type ClickTheBombTutorialProps = {
  page: number;
};

export const ClickTheBombTutorial = ({ page }: ClickTheBombTutorialProps) => {
  return (
    <>
      {page === 1 && <PageOne />}
      {page === 2 && <PageTwo />}
      {page === 3 && <PageThree />}
    </>
  );
};
