import { Text } from '@components/features/tutorials/components/Text.tsx';
import { Image } from '@components/features/tutorials/components/Image.tsx';
import { Button } from '@components/ui/button/Button.tsx';
import Bomb from '@assets/tutorials/Bomb.svg?react';

const PageOne = () => {
  return (
    <>
      <Text>
        You have to click the bomb <Text color="highlight">at least once</Text> before passing the turn to the next player
      </Text>
      <Image size="medium">
        <Bomb />
      </Image>
      <Text>
        Be quick! You’ve got <Text color="warning">10 seconds</Text> per move
      </Text>
    </>
  );
};

const PageTwo = () => {
  return (
    <>
      <Text>
        With every click, the <Text color="reward">prize pool</Text> increases. Every next click adds even more!
      </Text>
      <Text color="highlight">15 → 17 → 20 → 23 → 26 → 30 → 35</Text>
      <Text>
        Pass the turn to the next player to claim the <Text color="reward">prize pool</Text>
      </Text>
      <Button>Next</Button>
    </>
  );
};

const PageThree = () => {
  return (
    <>
      <Text>
        Boom! The bomb explodes — the <Text color="reward">prize pool</Text> is gone, and you lose <Text color="warning">50 points</Text>!
      </Text>
      <Image size="medium">
        <Bomb />
      </Image>
      <Text>
        The game lasts until <Text color="highlight">one player</Text> remains.
      </Text>
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
