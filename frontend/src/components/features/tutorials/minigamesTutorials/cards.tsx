import { Text } from '@components/features/tutorials/components/Text.tsx';
import { Image } from '@components/features/tutorials/components/Image.tsx';
import { Row } from '@components/ui/row/Row.tsx';
import { Icon } from '@assets/icon';
import { useContext } from 'react';
import { ThemeContext } from '@context/theme/ThemeContext.ts';
import CardPositiveLight from '@assets/tutorials/cardPositiveLight.svg?react';
import CardPositiveDark from '@assets/tutorials/cardPositiveDark.svg?react';
import CardNegative from '@assets/tutorials/cardNegative.svg?react';
import CardsDeckDark from '@assets/tutorials/cardsDeckDark.svg?react';
import CardsDeckLight from '@assets/tutorials/cardsDeckLight.svg?react';
import CardRandomDark from '@assets/tutorials/cardRandomDark.svg?react';
import CardRandomLight from '@assets/tutorials/cardRandomLight.svg?react';

type PageProps = {
  darkMode: boolean;
};

const PageOne = ({ darkMode }: PageProps) => {
  return (
    <>
      <Text variant="small">
        The game has <Text color="highlight">3 rounds</Text> and a deck of <Text color="highlight">9 cards</Text> which includes both{' '}
        <Text color="reward">positive</Text> and <Text color="warning">negative</Text> cards
      </Text>
      <Image size="large">{darkMode ? <CardsDeckDark /> : <CardsDeckLight />}</Image>
      <Text>
        Watch out! In each new round, more and more <Text color="warning">bombs</Text> will appear
      </Text>
    </>
  );
};

const PageTwo = ({ darkMode }: PageProps) => {
  return (
    <>
      <Text>To choose a card you have</Text>
      <Text variant="large" color="warning">
        10 seconds
      </Text>
      <Text>
        If you don’t pick one in time, a <Text color="highlight">random</Text> card will be selected for you
      </Text>
      <Image>{darkMode ? <CardRandomDark /> : <CardRandomLight />}</Image>
    </>
  );
};

const PageThree = ({ darkMode }: PageProps) => {
  return (
    <>
      <Text variant="small">
        If you and other players choose the{' '}
        <Text variant="small" color="highlight">
          same card
        </Text>
        , the{' '}
        <Text variant="small" color="reward">
          positive points
        </Text>{' '}
        will be{' '}
        <Text variant="small" color="highlight">
          split
        </Text>
      </Text>

      <Row gap={30}>
        {darkMode ? <CardPositiveDark /> : <CardPositiveLight />}
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

      <Text variant="small">
        For a{' '}
        <Text variant="small" color="warning">
          bomb
        </Text>
        , the penalty points are{' '}
        <Text variant="small" color="highlight">
          multiplied
        </Text>{' '}
        by the number of players
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
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      {page === 1 && <PageOne darkMode={darkMode} />}
      {page === 2 && <PageTwo darkMode={darkMode} />}
      {page === 3 && <PageThree darkMode={darkMode} />}
    </>
  );
};
