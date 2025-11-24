import { Text } from '@components/features/tutorials/components/Text.tsx';
import { Image } from '@components/features/tutorials/components/Image.tsx';
import { Row } from '@components/ui/row/Row.tsx';
import { Icon } from '@assets/icon';
import CardPositiveLight from '@assets/tutorials/cardPositiveLight.svg?react';
import CardNegative from '@assets/tutorials/cardNegative.svg?react';

const PageOne = () => {
  return (
    <>
      <Text>
        The game has <Text color="highlight">3 rounds</Text> and a deck of <Text color="highlight">9 cards</Text>
      </Text>
      <Image size="large">
        <div className="tutorial__cards__deck"></div>
      </Image>
      <Text>
        Watch out! In each new round, more and more <Text color="warning">bombs</Text> will appear
      </Text>
    </>
  );
};

const PageTwo = () => {
  return (
    <>
      <Text>To choose a card you have</Text>
      <Text variant="large" color="warning">
        10 seconds
      </Text>
      <Text>
        If you don’t pick one in time, a <Text color="highlight">random</Text> card will be selected for you
      </Text>
      <Image size="large">
        <div className="tutorial__cards__random"></div>
      </Image>
    </>
  );
};

const PageThree = () => {
  return (
    <>
      <Text>
        If you and other players choose the <Text color="highlight">same card</Text>, the <Text color="reward">positive points</Text> will be{' '}
        <Text color="highlight">split</Text> among all players
      </Text>
      <Row gap={30}>
        <CardPositiveLight />
        <div className="arrow right for-cards">
          <Icon icon={'Arrow'} />
        </div>
        <div>
          <Text>Ultra Mango Guy</Text>
          <Text color="highlight">+25</Text>
          <br />
          <Text>King Dog</Text>
          <Text color="highlight">+25</Text>
        </div>
      </Row>
      <Text>
        For a <Text color="warning">bomb</Text>, the penalty points are <Text color="highlight">multiplied</Text> by the number of players
      </Text>
      <Row gap={30}>
        <CardNegative />
        <div className="arrow right for-cards">
          <Icon icon={'Arrow'} />
        </div>
        <div>
          <Text>Ultra Mango Guy</Text>
          <Text color="warning">-100</Text>
          <br />
          <Text>King Dog</Text>
          <Text color="warning">-100</Text>
        </div>
      </Row>
    </>
  );
};

type CardsTutorialProps = {
  page: number;
};

export const CardsTutorial = ({ page }: CardsTutorialProps) => {
  return (
    <>
      {page === 1 && <PageOne />}
      {page === 2 && <PageTwo />}
      {page === 3 && <PageThree />}
    </>
  );
};
