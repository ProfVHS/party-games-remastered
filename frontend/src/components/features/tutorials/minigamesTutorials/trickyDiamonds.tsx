import { Text } from '@components/features/tutorials/components/Text.tsx';
import { Row } from '@components/ui/row/Row.tsx';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import CardWin from '@assets/tutorials/trickyDiamondCardWin.svg?react';
import CardLoss from '@assets/tutorials/trickyDiamondCardLoss.svg?react';

const PageOne = () => {
  return (
    <>
      <Text>
        The game lasts <Text color="highlight">3 rounds</Text>, in each round, you choose one of the three diamonds
      </Text>
      <Text>
        Choose wisely — you only have <Text color="warning">10 seconds</Text>!
      </Text>
      <div style={{ width: '60%', marginBottom: '1rem', marginTop: '1rem' }}>
        <Row gap={40}>
          <HighDiamond />
          <MediumDiamond />
          <LowDiamond />
        </Row>
        <Row gap={0}>
          <Text>+200</Text>
          <Text>+100</Text>
          <Text>+50</Text>
        </Row>
      </div>
    </>
  );
};

const PageTwo = () => {
  return (
    <>
      <Text>
        The diamond chosen by the <Text color="highlight">fewest</Text> players <Text color="reward">wins</Text>
      </Text>
      <div style={{ width: '80%' }}>
        <Row gap={30}>
          <CardLoss />
          <CardLoss />
          <CardWin />
        </Row>
      </div>

      <Text variant="small">
        If everyone choose{' '}
        <Text color="highlight" variant="small">
          evenly
        </Text>{' '}
        -{' '}
        <Text color="warning" variant="small">
          no one wins
        </Text>{' '}
        !
      </Text>
    </>
  );
};

const TrickyDiamondsPages = [PageOne, PageTwo];

type TrickyDiamondsTutorialProps = {
  page: number;
};

export const TrickyDiamondsTutorial = ({ page }: TrickyDiamondsTutorialProps) => {
  const CurrentPage = TrickyDiamondsPages[page - 1];
  return <CurrentPage />;
};
